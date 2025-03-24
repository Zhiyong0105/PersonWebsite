import { useEffect, useState, useRef } from "react";
import Blog from "../pages/Blog";
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { userAPI } from './api/user/user';
import { articleAPI } from './api/article/article';

export default function ListArticle() {
  const [articles, setArticles] = useState([]);
  const [pageSize] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const initialLoadCompleted = useRef(false);
  const pageChangeRef = useRef(false);

  // 获取文章列表
  const handleListArticle = async (page) => {
    if (loading) return; // 防止重复加载
    
    setLoading(true);
    setError(null);
    try {
      const data = await articleAPI.getArticleList({
        pageNum: page,
        pageSize,
        // 从 URL 获取搜索参数
        ...Object.fromEntries(new URLSearchParams(window.location.search))
      });
      
      if (Array.isArray(data.page)) {
        setArticles(data.page);
        setTotal(data.total);
      } else {
        setArticles([]);
        setTotal(0);
        setError('暂无相关文章');
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError(err.message || '获取文章列表失败');
      setArticles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 统一管理数据加载
  useEffect(() => {
    // 页面首次加载或 URL 参数变化时获取数据
    const handleUrlChange = () => {
      setPageNum(1); // 重置页码
      pageChangeRef.current = false; // 重置页码变化标记
      handleListArticle(1);
    };

    // 监听 popstate 事件（浏览器前进/后退）
    window.addEventListener('popstate', handleUrlChange);

    // 仅在组件首次挂载时加载数据
    if (!initialLoadCompleted.current) {
      handleListArticle(pageNum);
      initialLoadCompleted.current = true;
    }

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // 页码变化时获取数据
  useEffect(() => {
    // 避免首次加载重复调用 API
    if (initialLoadCompleted.current && pageChangeRef.current) {
      handleListArticle(pageNum);
    } else if (initialLoadCompleted.current) {
      // 标记页码已变化，下次变化时才调用 API
      pageChangeRef.current = true;
    }
  }, [pageNum]);

  // 处理 GitHub 登录
  useEffect(() => {
    const verifyGithubLogin = async () => {
      // const code = new URLSearchParams(window.location.search).get('code');
      const token = localStorage.getItem('token');
      const loginSource = sessionStorage.getItem('loginSource');
      if (!token && loginSource === 'github') {
        try {
          const data = await userAPI.verifyGithubToken();
          
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify({
              username: data.username,
              email: data.email
            }));
            sessionStorage.removeItem('loginSource');
            
            // 触发登录状态改变事件
            window.dispatchEvent(new Event('loginStateChanged'));
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
        }
      }
    };

    verifyGithubLogin();
  }, []);

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);
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
                    visitCount={article.visitCount/2}
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