import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  EyeIcon,  
  ChatBubbleLeftIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  PlusIcon,
  HandThumbUpIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsResponse, articlesResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/articles?limit=5&sort=createdAt&order=desc')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        setRecentArticles(articlesData.articles || []);
      }
    } catch (error) {
      console.error('获取仪表板数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: '总文章数',
      value: stats.totalArticles,
      icon: DocumentTextIcon,
      color: 'from-blue-500/10 to-blue-600/5',
      iconColor: 'text-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100/50'
    },
    {
      title: '总浏览量',
      value: stats.totalViews,
      icon: EyeIcon,
      color: 'from-green-500/10 to-green-600/5',
      iconColor: 'text-green-600',
      bgGradient: 'bg-gradient-to-br from-green-50 to-green-100/50'
    },
    {
      title: '总点赞数',
      value: stats.totalLikes,
      icon: HandThumbUpIcon,
      color: 'from-purple-500/10 to-purple-600/5',
      iconColor: 'text-purple-600',
      bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100/50'
    },
    {
      title: '总评论数',
      value: stats.totalComments,
      icon: ChatBubbleLeftIcon,
      color: 'from-orange-500/10 to-orange-600/5',
      iconColor: 'text-orange-600',
      bgGradient: 'bg-gradient-to-br from-orange-50 to-orange-100/50'
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '未知时间';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1天前';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)}个月前`;
    return `${Math.ceil(diffDays / 365)}年前`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-base-content/60 font-medium">加载中...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
            仪表板
          </h1>
          <p className="text-base-content/60 mt-2 font-medium">
            欢迎回来，查看您的博客统计数据
          </p>
        </div>
        <Link 
          to="/admin/editor" 
          className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          写新文章
        </Link>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            className={`
              relative overflow-hidden rounded-2xl border border-base-200/50 
              bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg 
              transition-all duration-300 group cursor-pointer
            `}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ 
              y: -4,
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            {/* 背景装饰 */}
            <div className={`absolute inset-0 ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  bg-gradient-to-br ${card.color} ring-1 ring-black/5
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <ArrowTrendingUpIcon className="h-5 w-5 text-base-content/30 group-hover:text-green-500 transition-colors duration-300" />
              </div>
              
              <div className="space-y-2">
                <p className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors duration-300">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-base-content/60">
                  {card.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 最近文章 */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-base-200/50 shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="p-6 border-b border-base-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-base-content">最近文章</h2>
                <p className="text-sm text-base-content/60">最新发布的5篇文章</p>
              </div>
            </div>
            <Link 
              to="/admin/articles" 
              className="btn btn-ghost btn-sm hover:bg-base-200/50 text-primary"
            >
              查看全部
            </Link>
          </div>
        </div>

        <div className="p-6">
          {recentArticles.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <DocumentTextIcon className="h-16 w-16 text-base-content/20 mx-auto mb-4" />
              <p className="text-base-content/60 font-medium mb-2">还没有文章</p>
              <p className="text-sm text-base-content/40 mb-6">开始创作您的第一篇文章吧</p>
              <Link to="/admin/editor" className="btn btn-primary">
                <PlusIcon className="h-5 w-5" />
                写文章
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {recentArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  className="group p-4 rounded-xl border border-base-200/30 hover:border-primary/20 hover:bg-base-50/30 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors duration-300 truncate">
                        {article.title || '无标题'}
                      </h3>
                      <p className="text-sm text-base-content/60 mt-1 line-clamp-2">
                        {article.excerpt || article.content?.substring(0, 100) + '...' || '暂无内容'}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-base-content/50">
                        <div className="flex items-center gap-1">
                          <CalendarDaysIcon className="h-4 w-4" />
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <EyeIcon className="h-4 w-4" />
                          <span>{article.views || 0} 次浏览</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HandThumbUpIcon className="h-4 w-4" />
                          <span>{article.likes || 0} 点赞</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`
                        px-2 py-1 rounded-lg text-xs font-medium
                        ${article.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                        }
                      `}>
                        {article.status === 'published' ? '已发布' : '草稿'}
                      </span>
                      <Link 
                        to={`/admin/editor/${article.id}`}
                        className="btn btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        编辑
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* 快速操作 */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Link 
          to="/admin/editor" 
          className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-base-200/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <PlusIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors duration-300">
                写新文章
              </h3>
              <p className="text-sm text-base-content/60">创作新的博客内容</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/admin/articles" 
          className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-base-200/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-base-content group-hover:text-blue-600 transition-colors duration-300">
                管理文章
              </h3>
              <p className="text-sm text-base-content/60">编辑和管理已有文章</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/admin/users" 
          className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-base-200/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-base-content group-hover:text-green-600 transition-colors duration-300">
                用户管理
              </h3>
              <p className="text-sm text-base-content/60">管理用户账户和权限</p>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
} 