import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { articleAPI } from './api/article/article';

export default function SimpleArticleList() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取最新文章
  const fetchLatestArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await articleAPI.getArticleList({
        pageNum: 1,
        pageSize: 3, // 只显示最新的3篇文章
        sortBy: 'latest'
      });
      
      if (Array.isArray(data.page)) {
        setArticles(data.page);
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError('获取文章失败');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  // 格式化日期 - 模仿图片中的格式
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 根据分类生成标签颜色
  const getCategoryColor = (category) => {
    const colors = {
      '技术': 'bg-blue-100 text-blue-800',
      '前端': 'bg-green-100 text-green-800', 
      '后端': 'bg-purple-100 text-purple-800',
      '算法': 'bg-orange-100 text-orange-800',
      '生活': 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // 生成默认标签
  const getDefaultTags = (index) => {
    const tagSets = [
      ['REACT', 'JAVASCRIPT', 'FRONTEND'],
      ['NODE.JS', 'BACKEND', 'API'],
      ['ALGORITHM', 'CODING', 'TECH']
    ];
    return tagSets[index % tagSets.length];
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="space-y-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            <div className="w-full sm:w-32 flex-shrink-0">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">暂无文章</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {articles.map((article, index) => (
        <motion.article
          key={article.id}
          variants={item}
          className="group"
        >
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            {/* 左侧日期 */}
            <div className="w-full sm:w-32 flex-shrink-0">
              <time className="text-sm text-gray-500 font-medium">
                {formatDate(article.createTime)}
              </time>
            </div>
            
            {/* 右侧内容 */}
            <div className="flex-1">
              {/* 文章标题 */}
              <h2 
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight cursor-pointer group-hover:text-gray-700 transition-colors"
                onClick={() => navigate(`/article/${article.id}`)}
              >
                {article.articleTitle}
              </h2>
              
              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {article.category ? (
                  <span className={`px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                ) : (
                  getDefaultTags(index).map((tag, tagIndex) => (
                    <span 
                      key={tag}
                      className={`px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded ${
                        tagIndex === 0 ? 'bg-pink-100 text-pink-800' :
                        tagIndex === 1 ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {tag}
                    </span>
                  ))
                )}
              </div>
              
              {/* 文章描述 */}
              <p className="text-gray-600 text-base leading-relaxed mb-4 line-clamp-2">
                {article.articleSummary}
              </p>
              
              {/* Read more 链接 */}
              <button
                onClick={() => navigate(`/article/${article.id}`)}
                className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium transition-colors group"
              >
                <span>Read more</span>
                <svg 
                  className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </motion.article>
      ))}
      
      {/* 查看更多按钮 */}
      <motion.div 
        className="text-center pt-8 mt-16 border-t border-gray-200"
        variants={item}
      >
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <span>All Posts</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
} 