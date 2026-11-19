import { useEffect, useRef, useState } from "react";
import { Avatar, Button, Input, Tooltip } from "antd";
import {
  CloseOutlined,
  MessageOutlined,
  MinusOutlined,
  ReloadOutlined,
  RobotOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { sendMessage } from "../../../services/client/chatbot.services";
import "./ChatBot.scss";

const { TextArea } = Input;

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Xin chào! Mình là trợ lý tư vấn của LaptopVN.Mình có thể giúp gì cho bạn?",
};

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, loading, isOpen, isMinimized]);

  // Tự động focus vào ô nhập
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Gửi tin nhắn
  const handleSendMessage = async (value = input) => {
    const content = value.trim();

    if (!content || loading) return;

    const userMessage = {
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessage(content, history);

      if (response?.code !== 200) {
        throw new Error(
          response?.message || "Không thể nhận phản hồi từ chatbot.",
        );
      }

      const result = response.data;

      setHistory(Array.isArray(result?.history) ? result.history : []);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result?.reply || "Mình chưa có câu trả lời cho câu hỏi này.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            error.message ||
            "Xin lỗi, hệ thống tư vấn đang gặp sự cố. Bạn vui lòng thử lại sau nhé!",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Enter để gửi, Shift + Enter để xuống dòng
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Tạo cuộc trò chuyện mới
  const handleNewConversation = () => {
    if (loading) return;

    setMessages([INITIAL_MESSAGE]);
    setHistory([]);
    setInput("");
  };

  return (
    <div className="chatbot">
      {/* NÚT MỞ CHATBOT */}
      {!isOpen && (
        <Tooltip title="Tư vấn cùng LaptopVN" placement="left">
          <Button
            type="primary"
            shape="circle"
            className="chatbot__launcher"
            icon={<MessageOutlined />}
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            aria-label="Mở trợ lý LaptopVN"
          />
        </Tooltip>
      )}

      {/* KHUNG CHAT */}
      {isOpen && (
        <section className="chatbot__panel" aria-label="Trợ lý LaptopVN">
          {/* HEADER */}
          <header className="chatbot__header">
            <div className="chatbot__brand">
              <Avatar
                className="chatbot__brand-avatar"
                icon={<RobotOutlined />}
              />

              <div>
                <div className="chatbot__brand-name">Trợ lý LaptopVN</div>

                <div className="chatbot__brand-status">
                  <span />
                  Tư vấn sản phẩm
                </div>
              </div>
            </div>

            <div className="chatbot__actions">
              <Tooltip title="Cuộc trò chuyện mới">
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={handleNewConversation}
                  disabled={loading}
                  aria-label="Tạo cuộc trò chuyện mới"
                />
              </Tooltip>

              <Tooltip title={isMinimized ? "Mở rộng" : "Thu nhỏ"}>
                <Button
                  type="text"
                  icon={<MinusOutlined />}
                  onClick={() => setIsMinimized((prev) => !prev)}
                  aria-label={
                    isMinimized ? "Mở rộng chatbot" : "Thu nhỏ chatbot"
                  }
                />
              </Tooltip>

              <Tooltip title="Đóng">
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => setIsOpen(false)}
                  aria-label="Đóng chatbot"
                />
              </Tooltip>
            </div>
          </header>

          {!isMinimized && (
            <>
              {/* KHU VỰC HIỂN THỊ TIN NHẮN */}
              <div className="chatbot__messages">
                {/* DANH SÁCH TIN NHẮN */}
                {messages.map((item, index) => (
                  <div
                    key={`${item.role}-${index}`}
                    className={`chatbot__message chatbot__message--${item.role}`}
                  >
                    {item.role === "assistant" && (
                      <Avatar
                        size={30}
                        className="chatbot__message-avatar"
                        icon={<RobotOutlined />}
                      />
                    )}

                    <div
                      className={[
                        "chatbot__bubble",
                        item.isError ? "chatbot__bubble--error" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="chatbot__sender">
                        {item.role === "assistant" ? "LaptopVN AI" : "Bạn"}
                      </div>

                      <div className="chatbot__content">{item.content}</div>
                    </div>

                    {item.role === "user" && (
                      <Avatar
                        size={30}
                        className="chatbot__user-avatar"
                        icon={<UserOutlined />}
                      />
                    )}
                  </div>
                ))}

                {/* HIỆU ỨNG ĐANG PHẢN HỒI */}
                {loading && (
                  <div className="chatbot__message chatbot__message--assistant">
                    <Avatar
                      size={30}
                      className="chatbot__message-avatar"
                      icon={<RobotOutlined />}
                    />

                    <div className="chatbot__typing">
                      <span />
                      <span />
                      <span />
                      <small>Đang suy nghĩ...</small>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* FOOTER - Ô NHẬP TIN NHẮN */}
              <footer className="chatbot__footer">
                <div className="chatbot__composer">
                  <TextArea
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập câu hỏi của bạn..."
                    autoSize={{
                      minRows: 1,
                      maxRows: 4,
                    }}
                    maxLength={2000}
                    disabled={loading}
                  />

                  <Button
                    type="primary"
                    className="chatbot__send"
                    icon={<SendOutlined />}
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || loading}
                    aria-label="Gửi tin nhắn"
                  />
                </div>
              </footer>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default Chatbot;
