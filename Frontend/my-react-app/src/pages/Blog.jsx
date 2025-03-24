import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CiCalendar } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";

export default function Blog({ id, articleTitle, createTime, articleSummary, visitCount, className = "" }) {
  const navigate = useNavigate();

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}月${day}日, ${year}年`;
  };

  // 格式化访问次数
  const formatVisitCount = (count) => {
    if (!count && count !== 0) return "";
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div 
      onClick={() => navigate(`/article/${id}`)}
      className={`cursor-pointer p-8 relative ${className}`}
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
      <p className="text-base-content/70 text-base line-clamp-3 leading-relaxed mb-6">
        {articleSummary}
      </p>
      
      {/* 访问次数显示 - 现代简约设计 */}
      {visitCount !== undefined && (
        <div className="absolute bottom-3 left-8 flex items-center gap-1.5 text-base-content/40 text-xs group-hover:text-base-content/60 transition-colors duration-300">
          <IoEyeOutline className="w-3.5 h-3.5" />
          <span>{formatVisitCount(visitCount)}</span>
        </div>
      )}
    </div>
  );
}


