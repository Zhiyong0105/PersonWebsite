import { useEffect, useState } from "react";
import Blog from "../pages/Blog";
import axiosInstance from "./Axios";
import { AnimatePresence } from "framer-motion";

export default function ListArticle() {
  const [articles, setArticles] = useState([]);

const [pageNum, setPageNum] = useState(1);
const [pageSize, setPageSize] = useState(10);

const handleListArticle = async () => {
  try {
    const response = await axiosInstance.get("/article/list", {
      params: { pageNum, pageSize },
    });
    const { code, data } = response.data;
    if (code === 200) {
      setArticles(data.page);
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
};

  useEffect(() => {
    handleListArticle();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Article List</h1>
      <div className="flex flex-wrap gap-6 justify-center">
        {articles.map((article) => (
          <Blog
            key={article.id}
            id={article.id}
            articleTitle={article.articleTitle}
            createTime={article.createTime}
          />
        ))}
      </div>
    </div>
  );
}
