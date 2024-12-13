import { useEffect, useState } from "react";
import Blog from "../pages/Blog";
import axiosInstance from "./Axios";
import { LazyMotion, domAnimation, m } from 'framer-motion';

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
    <div className="container mx-auto px-4 py-8 justify-center items-center">
      <h1 className="text-2xl font-bold text-white mb-6">Article List</h1>
      <div className="flex flex-wrap gap-6 justify-center">
        <LazyMotion features={domAnimation}>
          {articles.map((article, index) => (
            <m.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2, // 动画逐个延迟
                duration: 0.5,     // 每个动画持续时间
              }}
              className="w-full lg:w-1/2"
            >
              <Blog
                id={article.id}
                articleTitle={article.articleTitle}
                createTime={article.createTime}
              />
            </m.div>
          ))}
        </LazyMotion>
      </div>
      <div className="flex justify-center items-center mt-8">
        <button className="join-item btn">«</button>
        <button className="join-item btn">Page 22</button>
        <button className="join-item btn">»</button>
      </div>
    </div>
  );
}
