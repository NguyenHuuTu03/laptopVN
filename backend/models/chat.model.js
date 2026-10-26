const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: String,
    sessionId: String,
    title: String,
    messages: [
      {
        role: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        products: [
          {
            productId: String,
            variantId: String,
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

const ChatAI = mongoose.model("ChatAI", chatSchema, "chats");
