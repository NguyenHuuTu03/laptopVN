import { post } from "../../utils/request";

export const sendMessage = async (message, history = []) => {
  const result = await post("/chatbot/chat", {
    message,
    history,
  });

  return result;
};
