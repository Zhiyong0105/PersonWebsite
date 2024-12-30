import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CiCalendar } from "react-icons/ci";

export default function Blog({ id, articleTitle, createTime, articleSummary, className = "" }) {
  const navigate = useNavigate();

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}月${day}日, ${year}年`;
  };

  return (
    <div 
      onClick={() => navigate(`/article/${id}`)}
      className={`cursor-pointer p-8 ${className}`}
    >
      <h2 className="text-2xl font-semibold mb-3 line-clamp-2 
                     text-base-content/90 transition-colors duration-300
                     group-hover:text-primary tracking-wide">
        {articleTitle}
      </h2>
      <div className="flex items-center gap-2 text-base-content/50 text-sm mb-4">
        <CiCalendar className="w-4 h-4" />
        <span className="font-medium">{formatDate(createTime)}</span>
      </div>
      <p className="text-base-content/70 text-base line-clamp-3 leading-relaxed">
        {articleSummary}
      </p>
    </div>
  );
}


