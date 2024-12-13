import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Blog({ id, articleTitle, createTime }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/${id}`); // 跳转到 /{article.id}
  };

  return (
    <motion.div
      layoutId={`card-${id}`}
      onClick={handleCardClick}
      whileHover={{ scale: 1.05 }}
      className=" relative w-full max-w-[40%] p-6 bg-base-100 shadow-lg rounded-lg cursor-pointer transition-transform hover:shadow-2xl"
    >
      <motion.div
        layoutId={`title-${id}`}
        whileHover={{ color: "#d1d5db" }}
        className=" text-lg font-bold text-white hover:underline"
      >
        {articleTitle}
      </motion.div>
      <motion.p
        layoutId={`date-${id}`}
        className="text-sm text-gray-400 mt-2"
      >
        {createTime ? new Date(createTime).toLocaleString() : "N/A"}
      </motion.p>
    </motion.div>
  );
}
