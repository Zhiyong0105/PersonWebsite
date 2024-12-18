import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CiCalendar } from "react-icons/ci";

export default function Blog({ id, articleTitle, createTime,articleSummary }) {
  const navigate = useNavigate();


  const handleCardClick = () => {
    navigate(`/article/${id}`); // 跳转到 /{article.id}
  };

  return (
    <motion.div
      layoutId={`card-${id}`}
      onClick={handleCardClick}
      whileHover={{ scale: 1.05 }}
      className="relative w-full max-w-[100%] md:max-w-[100%] lg:max-w-[100%] bg-base-100  dark:text-white rounded-lg cursor-pointer transition-transform hover:shadow-2xl"
    >
      <motion.div
        layoutId={`title-${id}`}
        whileHover={{ color: "#d1d5db" }}
        className="text-lg font-bold text-black-500 dark:text-white  hover:underline"
      >
        {articleTitle}
      </motion.div>
      <motion.div
        layoutId={`content-${id}`}
        whileHover={{ color: "#d1d5db" }}
        className=" font-bold text-black-500 dark:text-white  hover:underline"
      >
        {articleSummary}
      </motion.div>
      <motion.p
        layoutId={`date-${id}`}
        className="text-sm text-gray-400 mt-2"
      >
<span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <CiCalendar />
  {createTime
    ? (() => {
        const date = new Date(createTime);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
       return `${month}月${day}日, ${year}年`;
      })()
    : "N/A"}
</span>
                
      </motion.p>
    </motion.div>
  );
}


