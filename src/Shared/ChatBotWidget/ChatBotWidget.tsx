import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "../../context/TranslationContext";
import styles from "./ChatBotWidget.module.css";

const s = styles as Record<string, string>;

const ChatBotWidget: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on AI chat page itself
  if (location.pathname.toLowerCase() === "/ai-chat") return null;

  return (
    <motion.button
      className={s.fab}
      onClick={() => navigate("/ai-chat")}
      whileTap={{ scale: 0.9 }}
      aria-label={t("Open AI Assistant", "افتح المساعد الذكي")}
    >
      <MessageCircle size={26} />
    </motion.button>
  );
};

export default ChatBotWidget;
