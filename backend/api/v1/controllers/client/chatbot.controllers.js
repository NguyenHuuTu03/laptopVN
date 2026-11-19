const { chatWithAI } = require("../../../../services/chatbot.services");

module.exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.json({
        code: 400,
        message: "Vui lòng nhập nội dung tin nhắn",
      });
    }

    if (message.length > 2000) {
      return res.json({
        code: 400,
        message: "Tin nhắn không được vượt quá 2000 ký tự",
      });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter((item) => ["user", "assistant"].includes(item.role))
          .slice(-5)
      : [];

    const result = await chatWithAI(message.trim(), safeHistory);

    return res.json({
      code: 200,
      message: "Chat thành công",
      data: result,
    });
  } catch (error) {
    console.error("Chatbot error:", error);

    return res.json({
      code: 500,
      message: "Chatbot hiện không thể trả lời. Vui lòng thử lại.",
    });
  }
};
