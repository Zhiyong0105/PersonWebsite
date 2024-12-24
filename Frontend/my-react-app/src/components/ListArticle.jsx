import { useEffect, useState } from "react";
import Blog from "../pages/Blog";
import axiosInstance from "./Axios";
import { LazyMotion, domAnimation, m } from 'framer-motion';

export default function ListArticle() {
  const [articles, setArticles] = useState([]);
  const [pageSize] = useState(5);
  const [pageNum] = useState(1);

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
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-base-content pl-4">
            最新文章
          </h1>

          <div className="space-y-4">
            <LazyMotion features={domAnimation}>
              {articles.map((article, index) => (
                <m.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.5,
                  }}
                  className="group overflow-hidden rounded-xl transition-all duration-300
                           hover:bg-base-200/50 hover:shadow-lg w-[90%]"
                >
                  <Blog
                    id={article.id}
                    articleTitle={article.articleTitle}
                    createTime={article.createTime}
                    articleSummary={article.articleSummary}
                    className="group-hover:-translate-y-1 transition-transform duration-300"
                  />
                </m.div>
              ))}
            </LazyMotion>
          </div>
        </div>
      </div>
    </div>
  );
}
