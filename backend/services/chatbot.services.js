const Groq = require("groq-sdk");
const Products = require("../models/product.model");
const ProductVariants = require("../models/product_variants.model");
const convertHelpers = require("../helpers/convert");
const caculateHelpers = require("../helpers/caculate");
const checkHelpers = require("../helpers/check");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const SYSTEM_PROMPT = `
Bạn là trợ lý tư vấn mua sắm trực tuyến của cửa hàng LaptopVN.

NHIỆM VỤ:
- Tư vấn các sản phẩm công nghệ tại LaptopVN.
- Tìm kiếm sản phẩm theo tên, thương hiệu, danh mục và giá.
- Tư vấn cấu hình CPU, RAM, SSD, GPU, màn hình.
- So sánh các sản phẩm.
- Gợi ý sản phẩm phù hợp với nhu cầu và ngân sách.
- Giải thích ưu điểm, nhược điểm của sản phẩm.
- Hỗ trợ khách hàng lựa chọn phiên bản phù hợp.

NGUYÊN TẮC:
1. Chỉ sử dụng dữ liệu sản phẩm được cung cấp từ hệ thống.
2. Không tự tạo tên sản phẩm, giá bán hoặc thông số kỹ thuật.
3. Không tự khẳng định sản phẩm còn hàng nếu chưa kiểm tra stock.
4. Chỉ tư vấn sản phẩm có deleted = false và status = active.
5. Chỉ sử dụng các phiên bản có status = active.
6. Giá bán phải sử dụng priceNew từ dữ liệu hệ thống.
7. Nếu stock = 0, phải thông báo sản phẩm hoặc phiên bản đã hết hàng.
8. Không tự suy diễn cấu hình khi dữ liệu không có.
9. Nếu không tìm thấy sản phẩm, phải thông báo rõ.
10. Nếu khách hàng chưa cung cấp đủ thông tin, hãy hỏi thêm.
11. Trả lời bằng tiếng Việt, thân thiện, dễ hiểu.
12. Khi đề xuất sản phẩm, phải giải thích lý do lựa chọn.
13. Khi so sánh, cần nêu rõ điểm giống và khác nhau.
14. Không tự tạo đường dẫn sản phẩm nếu hệ thống không cung cấp.

CÁCH TƯ VẤN:
- Ưu tiên nhu cầu sử dụng của khách hàng.
- Quan tâm đến ngân sách trước khi đề xuất.
- Phân biệt rõ cấu hình giữa các phiên bản.
- Không nhầm lẫn giữa sản phẩm và phiên bản sản phẩm.
- Nếu có nhiều phiên bản, hãy giải thích sự khác biệt.
- Nếu không có đủ dữ liệu để kết luận, hãy nói rõ.
`;

const tools = [
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Tìm kiếm sản phẩm LaptopVN theo tên, thương hiệu, danh mục, giá, RAM và SSD.",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description: "Tên sản phẩm hoặc từ khóa tìm kiếm.",
          },
          brandId: {
            type: "string",
            description: "ID thương hiệu trong MongoDB.",
          },
          categoryId: {
            type: "string",
            description: "ID danh mục trong MongoDB.",
          },
          minPrice: {
            type: "number",
            description: "Giá bán thấp nhất, đơn vị VND.",
          },
          maxPrice: {
            type: "number",
            description: "Giá bán cao nhất, đơn vị VND.",
          },
          ram: {
            type: "number",
            description: "Dung lượng RAM cần tìm, đơn vị GB.",
          },
          ssd: {
            type: "number",
            description: "Dung lượng SSD cần tìm, đơn vị GB.",
          },
          limit: {
            type: "number",
            description: "Số lượng sản phẩm muốn tìm, tối đa 5.",
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "compare_products",
      description: "So sánh từ 2 đến 5 sản phẩm LaptopVN theo tên sản phẩm.",
      parameters: {
        type: "object",
        properties: {
          productNames: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Danh sách tên sản phẩm cần so sánh.",
          },
        },
        required: ["productNames"],
        additionalProperties: false,
      },
    },
  },
];

// Chuẩn hóa dữ liệu phiên bản.
const formatVariant = (variant) => ({
  _id: variant._id,
  sku: variant.sku,
  attributes: variant.attributes || [],
  price: Number(variant.price || 0),
  discount: Number(variant.discount || 0),
  priceNew: caculateHelpers.priceNew(variant.price, variant.discount),
  stock: Number(variant.stock || 0),
  sold: Number(variant.sold || 0),
  thumbnail: variant.thumbnail || "",
});

// Chuẩn hóa dữ liệu sản phẩm.
const formatProduct = (product, variants) => ({
  _id: product._id,
  title: product.title,
  description: product.description || "",
  brandId: product.brandId,
  categoryId: product.categoryId,
  thumbnail: product.thumbnail || "",
  images: product.images || [],
  specifications: product.specifications || [],
  warranty: product.warranty || "",
  variants: variants.map((variant) => {
    return formatVariant(variant);
  }),
});

const searchProducts = async (args = {}) => {
  try {
    const {
      keyword,
      brandId,
      categoryId,
      minPrice,
      maxPrice,
      ram,
      ssd,
      limit = 5,
    } = args;

    if (
      minPrice != null &&
      maxPrice != null &&
      Number(minPrice) > Number(maxPrice)
    ) {
      return {
        total: 0,
        products: [],
        message: "Khoảng giá không hợp lệ.",
      };
    }

    const find = {
      deleted: false,
      status: "active",
    };

    if (keyword) {
      const regex = new RegExp(convertHelpers.convertRegex(keyword), "i");

      find.$or = [{ title: regex }, { description: regex }];
    }

    if (brandId) {
      find.brandId = brandId;
    }

    if (categoryId) {
      find.categoryId = categoryId;
    }

    const products = await Products.find(find)
      .sort({ position: -1, createdAt: -1 })
      .lean();

    if (!products.length) {
      return {
        total: 0,
        products: [],
        message: "Không tìm thấy sản phẩm phù hợp.",
      };
    }

    const productIds = products.map((product) => product._id);

    const variants = await ProductVariants.find({
      productId: { $in: productIds },
      status: "active",
    });

    const result = [];

    for (const product of products) {
      const productVariants = variants.filter(
        (variant) => variant.productId == product._id,
      );

      // Lọc các phiên bản phù hợp.
      const findVariants = productVariants.filter((variant) => {
        const priceNew = caculateHelpers.priceNew(
          variant.price,
          variant.discount,
        );

        if (minPrice != null && priceNew < Number(minPrice)) {
          return false;
        }

        if (maxPrice != null && priceNew > Number(maxPrice)) {
          return false;
        }

        if (!checkHelpers.checkAttributes(variant.attributes, "ram", ram)) {
          return false;
        }

        if (!checkHelpers.checkAttributes(variant.attributes, "ssd", ssd)) {
          return false;
        }

        return true;
      });

      if (!findVariants.length) continue;

      result.push(formatProduct(product, findVariants));
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 5);

    const productsResult = result.slice(0, safeLimit).map((product) => ({
      ...product,
      variants: product.variants.slice(0, 3),
    }));

    return {
      total: result.length,
      products: productsResult,
      message:
        result.length > 0
          ? "Tìm thấy sản phẩm phù hợp."
          : "Không tìm thấy sản phẩm phù hợp.",
    };
  } catch (error) {
    console.error("searchProducts error:", error);
    throw error;
  }
};

const compareProducts = async (args = {}) => {
  try {
    const productNames = Array.isArray(args.productNames)
      ? args.productNames
          .filter((name) => typeof name === "string")
          .map((name) => name.trim())
          .filter(Boolean)
      : [];

    if (productNames.length < 2) {
      return {
        total: 0,
        products: [],
        message: "Cần ít nhất 2 sản phẩm để so sánh.",
      };
    }

    const products = [];

    for (const name of productNames.slice(0, 5)) {
      const nameRegex = new RegExp(convertHelpers.convertRegex(name), "i");
      const product = await Products.findOne({
        title: nameRegex,
        deleted: false,
        status: "active",
      }).lean();

      if (!product) {
        products.push({
          searchedName: name,
          error: "Không tìm thấy sản phẩm.",
        });

        continue;
      }

      // Lấy toàn bộ phiên bản đang hoạt động.
      const variants = await ProductVariants.find({
        productId: product._id,
        status: "active",
      })
        .sort({ price: 1 })
        .lean();

      products.push(formatProduct(product, variants));
    }

    return {
      total: products.filter((product) => !product.error).length,
      products,
    };
  } catch (error) {
    console.error("compareProducts error:", error);
    throw error;
  }
};

const executeTool = async (toolName, args) => {
  switch (toolName) {
    case "search_products":
      return searchProducts(args);

    case "compare_products":
      return compareProducts(args);

    default:
      throw new Error(`Function không tồn tại: ${toolName}`);
  }
};

const normalizeHistory = (history = []) => {
  return history
    .filter((item) => ["user", "assistant"].includes(item.role))
    .slice(-5)
    .map((item) => ({
      role: item.role,
      content: item.content,
    }));
};

const chatWithAI = async (message, history = []) => {
  try {
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },

      ...normalizeHistory(history),

      {
        role: "user",
        content: message,
      },
    ];

    // Giới hạn số vòng Function Calling.
    for (let i = 0; i < 5; i++) {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        tool_choice: "auto",
        temperature: 0.3,
      });

      const assistantMessage = completion.choices[0].message;

      messages.push(assistantMessage);

      if (!assistantMessage.tool_calls?.length) {
        const conversationHistory = messages
          .filter((item) => ["user", "assistant"].includes(item.role))
          .slice(-5)
          .map((item) => ({
            role: item.role,
            content: item.content,
          }));

        return {
          reply: assistantMessage.content || "",
          history: conversationHistory,
        };
      }

      for (const toolCall of assistantMessage.tool_calls) {
        const name = toolCall.function.name;

        let args = {};

        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch (error) {
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              error: "Tham số Function không hợp lệ.",
            }),
          });

          continue;
        }

        let result;

        try {
          result = await executeTool(name, args);
        } catch (error) {
          console.error("executeTool error:", error);

          result = {
            error: "Không thể truy vấn dữ liệu sản phẩm.",
          };
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    throw new Error("Chatbot vượt quá số lần gọi Function.");
  } catch (error) {
    console.error("chatWithAI error:", error);
    throw error;
  }
};

module.exports = {
  chatWithAI,
};
