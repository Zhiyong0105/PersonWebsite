import { useEffect, useState } from "react";
import Blog from "../pages/Blog";
import axiosInstance from "./Axios";
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function ListArticle() {
  const [articles, setArticles] = useState([]);
  const [pageSize] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleListArticle = async (page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/article/list", {
        params: { pageNum: page, pageSize },
      });
      const { code, data } = response.data;
      if (code === 200) {
        setArticles(data.page);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleListArticle(pageNum);
  }, [pageNum]);

  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isFromGithub = urlParams.get('from') === 'github';

      if (isFromGithub) {
        try {
          const response = await axiosInstance.get('/user/github/verifyToken', {
            withCredentials: true
          });
          
          if (response.data.code === 200) {
            const { token, username, email } = response.data.data;
            if (token) {
              localStorage.setItem('token', token);
              const userInfo = {
                username:username,
                role: 'guest', // 根据测试账号设置权限
                email: email
              };
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
              console.log(userInfo);
              window.location.href = '/article';
            }
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
        }
      }
    };

    getToken();
  }, []);

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  // 分页按钮组件
  const PaginationButton = ({ page, active, disabled, children, onClick }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative h-10 min-w-[40px] px-3.5 
        flex items-center justify-center gap-2
        transition-all duration-300
        rounded-lg text-sm font-medium
        ${active 
          ? 'bg-base-200 text-primary border-base-300' 
          : 'bg-base-100 text-base-content/70 hover:bg-base-200/70 hover:text-base-content'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer'
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-primary/30 rounded-full" />
              <div>
                <h1 className="text-3xl font-bold text-base-content">
                  Latest Articles
                </h1>
                <p className="mt-2 text-base-content/60">
                  记录学习与思考
                </p>
              </div>
            </div>
          </div>

          <LazyMotion features={domAnimation}>
            <div className="space-y-4">
              {articles.map((article, index) => (
                <m.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.3,
                  }}
                  className="group overflow-hidden rounded-xl transition-all duration-300
                           hover:bg-base-200/50 hover:shadow-lg w-[90%]
                           border border-base-200/50"
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
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <PaginationButton
                  onClick={() => setPageNum(prev => Math.max(1, prev - 1))}
                  disabled={pageNum === 1 || loading}
                >
                  <IoChevronBack className="w-4 h-4" />
                  <span className="text-sm">上一页</span>
                </PaginationButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 || 
                           page === totalPages || 
                           Math.abs(page - pageNum) <= 1;
                  })
                  .map((page, index, array) => {
                    if (index > 0 && page - array[index - 1] > 1) {
                      return (
                        <span key={`ellipsis-${page}`} className="px-2 text-base-content/50">
                          •••
                        </span>
                      );
                    }
                    return (
                      <PaginationButton
                        key={page}
                        page={page}
                        active={page === pageNum}
                        onClick={() => setPageNum(page)}
                        disabled={loading}
                      >
                        {page}
                      </PaginationButton>
                    );
                  })}

                <PaginationButton
                  onClick={() => setPageNum(prev => Math.min(totalPages, prev + 1))}
                  disabled={pageNum === totalPages || loading}
                >
                  <span className="text-sm">下一页</span>
                  <IoChevronForward className="w-4 h-4" />
                </PaginationButton>
              </div>
            )}
          </LazyMotion>
        </div>
      </div>
    </div>
  );
}
