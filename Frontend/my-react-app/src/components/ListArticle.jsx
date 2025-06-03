import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelIcon,
  ClockIcon,
  BookOpenIcon,
  TagIcon,
  CalendarDaysIcon,
  EyeIcon,
  ChevronRightIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  ChartBarIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { userAPI } from './api/user/user';
import { articleAPI } from './api/article/article';

export default function ListArticle() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageSize] = useState(8);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const initialLoadCompleted = useRef(false);

  // 获取文章列表
  const handleListArticle = async (page, category = 'all', sort = 'latest') => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    try {
      const params = {
        pageNum: page,
        pageSize,
        category: category !== 'all' ? category : undefined,
        sortBy: sort
      };

      const data = await articleAPI.getArticleList(params);
      
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

  // 获取精选文章
  const fetchFeaturedArticles = async () => {
    try {
      const data = await articleAPI.getFeaturedArticles();
      setFeaturedArticles(data.slice(0, 3));
    } catch (err) {
      console.error("Error fetching featured articles:", err);
    }
  };

  // 获取热门文章
  const fetchTrendingArticles = async () => {
    try {
      const data = await articleAPI.getTrendingArticles();
      setTrendingArticles(data.slice(0, 8));
    } catch (err) {
      console.error("Error fetching trending articles:", err);
    }
  };

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const data = await articleAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // 设置默认分类
      setCategories([
        { name: '技术', count: 15 },
        { name: '前端', count: 8 },
        { name: '后端', count: 6 },
        { name: '算法', count: 4 },
        { name: '生活', count: 3 }
      ]);
    }
  };

  // 初始化数据
  useEffect(() => {
    if (!initialLoadCompleted.current) {
      handleListArticle(1);
      fetchFeaturedArticles();
      fetchTrendingArticles();
      fetchCategories();
      initialLoadCompleted.current = true;
    }
  }, []);

  // 搜索和筛选
  useEffect(() => {
    if (initialLoadCompleted.current) {
      setPageNum(1);
      handleListArticle(1, selectedCategory, sortBy);
    }
  }, [selectedCategory, sortBy]);

  // 页码变化
  useEffect(() => {
    if (initialLoadCompleted.current && pageNum > 1) {
      handleListArticle(pageNum, selectedCategory, sortBy);
    }
  }, [pageNum]);

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1天前';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}周前`;
    return date.toLocaleDateString('zh-CN');
  };

  // 格式化访问次数
  const formatVisitCount = (count) => {
    if (!count) return '0';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const totalPages = Math.ceil(total / pageSize);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            个人技术博客，分享前端开发、编程技术与生活感悟
          </p>
          <div className="mt-8 text-sm text-gray-500">
            共 <span className="font-semibold text-gray-700">{total}</span> 篇文章
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div 
          className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {categories.slice(0, 5).map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.name
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="latest">最新发布</option>
            <option value="popular">最受欢迎</option>
            <option value="trending">趋势文章</option>
          </select>
        </motion.div>

        {/* Articles List */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {loading ? (
            <div className="space-y-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border-b border-gray-200 pb-8">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6 w-5/6"></div>
                    <div className="flex items-center gap-4">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 p-3 bg-gray-100 rounded-full">
                <BookOpenIcon className="h-full w-full text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">获取文章失败</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => handleListArticle(pageNum, selectedCategory, sortBy)}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                重试
              </button>
            </motion.div>
          ) : articles.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 p-3 bg-gray-100 rounded-full">
                <BookOpenIcon className="h-full w-full text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无文章</h3>
              <p className="text-gray-600">该分类下暂无文章</p>
            </motion.div>
          ) : (
            <>
              {articles.map((article, index) => (
                <motion.article
                  key={article.id}
                  variants={item}
                  className="group border-b border-gray-200 pb-8 last:border-b-0 cursor-pointer"
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
                      {article.articleTitle}
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-4 line-clamp-2">
                    {article.articleSummary}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>Published on {formatDate(article.createTime)}</span>
                    </div>
                    
                    {article.category && (
                      <div className="flex items-center gap-1">
                        <TagIcon className="h-4 w-4" />
                        <span className="text-gray-700 font-medium">{article.category}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{formatVisitCount(article.visitCount)} views</span>
                    </div>
                    
                    <div className="ml-auto">
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium transition-colors">
                        Read more →
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </>
          )}

          {/* Pagination */}
          {!loading && !error && articles.length > 0 && totalPages > 1 && (
            <motion.div 
              className="flex justify-center items-center gap-2 pt-12 mt-12 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() => setPageNum(prev => Math.max(1, prev - 1))}
                disabled={pageNum === 1}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              
              <div className="flex items-center gap-2 mx-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 || page === totalPages || Math.abs(page - pageNum) <= 1;
                  })
                  .map((page, index, array) => {
                    if (index > 0 && page - array[index - 1] > 1) {
                      return (
                        <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setPageNum(page)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          page === pageNum
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>
              
              <button
                onClick={() => setPageNum(prev => Math.min(totalPages, prev + 1))}
                disabled={pageNum === totalPages}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom Section - Featured/Trending Articles */}
        {(featuredArticles.length > 0 || trendingArticles.length > 0) && (
          <motion.div 
            className="mt-20 pt-12 border-t border-gray-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Featured Articles */}
              {featuredArticles.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <SparklesIcon className="h-6 w-6" />
                    精选推荐
                  </h3>
                  <div className="space-y-4">
                    {featuredArticles.map((article) => (
                      <div
                        key={`featured-${article.id}`}
                        onClick={() => navigate(`/article/${article.id}`)}
                        className="group p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
                      >
                        <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors">
                          {article.articleTitle}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {formatDate(article.createTime)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Articles */}
              {trendingArticles.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ArrowTrendingUpIcon className="h-6 w-6" />
                    热门文章
                  </h3>
                  <div className="space-y-4">
                    {trendingArticles.slice(0, 5).map((article, index) => (
                      <div
                        key={`trending-${article.id}`}
                        onClick={() => navigate(`/article/${article.id}`)}
                        className="group flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 rounded-full text-sm flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-gray-700 transition-colors">
                            {article.articleTitle}
                          </h4>
                          <div className="text-sm text-gray-500">
                            {formatVisitCount(article.visitCount)} views
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}