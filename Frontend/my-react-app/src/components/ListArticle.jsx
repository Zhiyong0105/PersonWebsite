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
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10">
          
          {/* Left Sidebar - 更窄，更紧凑 */}
          <motion.div 
            className="lg:col-span-3 xl:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 分类卡片 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <TagIcon className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">分类</h3>
              </div>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-gray-100 text-gray-900'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="font-medium text-sm">全部</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-medium">
                    {total}
                  </span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-gray-100 text-gray-900'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="font-medium text-sm">{category.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-medium">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 精选推荐 */}
            {featuredArticles.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <SparklesIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">精选</h3>
                </div>
                <div className="space-y-2">
                  {featuredArticles.map((article) => (
                    <div
                      key={`featured-sidebar-${article.id}`}
                      onClick={() => navigate(`/article/${article.id}`)}
                      className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-snug">
                        {article.articleTitle}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CalendarDaysIcon className="h-3 w-3" />
                        <span>{formatDate(article.createTime)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Main Content - 更宽，主要内容区 */}
          <motion.div 
            className="lg:col-span-6 xl:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* 筛选栏 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <BookOpenIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedCategory === 'all' ? '全部文章' : selectedCategory}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">共 {total} 篇文章</p>
                  </div>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 min-w-[140px]"
                >
                  <option value="latest">最新发布</option>
                  <option value="popular">最受欢迎</option>
                  <option value="trending">趋势文章</option>
                </select>
              </div>
            </div>

            {/* 文章列表 */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-5"
            >
              {loading ? (
                <div className="space-y-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                        <div className="flex justify-between">
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <motion.div 
                  className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 p-3 bg-gray-100 rounded-lg">
                    <BookOpenIcon className="h-full w-full text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">获取文章失败</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button 
                    onClick={() => handleListArticle(pageNum, selectedCategory, sortBy)}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    重试
                  </button>
                </motion.div>
              ) : articles.length === 0 ? (
                <motion.div 
                  className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 p-3 bg-gray-100 rounded-lg">
                    <BookOpenIcon className="h-full w-full text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无文章</h3>
                  <p className="text-gray-600">该分类下暂无文章</p>
                </motion.div>
              ) : (
                <>
                  {articles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      variants={item}
                      whileHover={{ y: -2 }}
                      className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md cursor-pointer transition-all"
                      onClick={() => navigate(`/article/${article.id}`)}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 group-hover:text-gray-700 transition-colors">
                            {article.articleTitle}
                          </h3>
                          {article.category && (
                            <span className="ml-4 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded flex items-center gap-1 whitespace-nowrap">
                              <TagIcon className="h-3 w-3" />
                              {article.category}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {article.articleSummary}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <CalendarDaysIcon className="h-4 w-4" />
                              <span>{formatDate(article.createTime)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <EyeIcon className="h-4 w-4" />
                              <span>{formatVisitCount(article.visitCount)}</span>
                            </div>
                          </div>
                          <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}

              {/* 分页 */}
              {!loading && !error && articles.length > 0 && totalPages > 1 && (
                <motion.div 
                  className="flex flex-wrap justify-center items-center gap-2 mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={() => setPageNum(prev => Math.max(1, prev - 1))}
                    disabled={pageNum === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    上一页
                  </button>
                  
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
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            page === pageNum
                              ? 'bg-gray-900 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  
                  <button
                    onClick={() => setPageNum(prev => Math.min(totalPages, prev + 1))}
                    disabled={pageNum === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    下一页
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Right Sidebar - 更窄，信息展示 */}
          <motion.div 
            className="lg:col-span-3 xl:col-span-3 space-y-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* 热门文章 */}
            {trendingArticles.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">热门</h3>
                </div>
                <div className="space-y-2">
                  {trendingArticles.slice(0, 6).map((article, index) => (
                    <div
                      key={`trending-${article.id}`}
                      onClick={() => navigate(`/article/${article.id}`)}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <span className="flex-shrink-0 w-5 h-5 bg-gray-200 text-gray-600 rounded text-xs flex items-center justify-center font-medium mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">
                          {article.articleTitle}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <EyeIcon className="h-3 w-3" />
                          <span>{formatVisitCount(article.visitCount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 网站统计 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">统计</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 font-medium text-sm">文章</span>
                  </div>
                  <span className="font-semibold text-gray-900">{total}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 font-medium text-sm">分类</span>
                  </div>
                  <span className="font-semibold text-gray-900">{categories.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 font-medium text-sm">本月</span>
                  </div>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}