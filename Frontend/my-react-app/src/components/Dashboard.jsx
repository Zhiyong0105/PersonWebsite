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
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
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
  const [drafts, setDrafts] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
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

      // Mock data for additional sections
      setDrafts([
        { id: 1, title: '未完成的技术分享', updatedAt: '2024-03-20T10:30:00Z' },
        { id: 2, title: '项目经验总结', updatedAt: '2024-03-19T14:20:00Z' },
        { id: 3, title: '学习笔记草稿', updatedAt: '2024-03-18T09:15:00Z' }
      ]);

      setRecentComments([
        { id: 1, author: '张三', content: '写得很好，学到了很多！', articleTitle: 'React最佳实践', createdAt: '2024-03-20T15:30:00Z' },
        { id: 2, author: '李四', content: '期待更多这样的教程', articleTitle: 'JavaScript高级技巧', createdAt: '2024-03-20T12:20:00Z' },
        { id: 3, author: '王五', content: '代码示例很清晰', articleTitle: 'CSS动画详解', createdAt: '2024-03-19T18:45:00Z' }
      ]);
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
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
      gradient: 'from-blue-500/10 to-blue-600/10',
      trend: '+12%'
    },
    {
      title: '总浏览量',
      value: stats.totalViews,
      icon: EyeIcon,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      hoverBg: 'hover:bg-emerald-100',
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      trend: '+8%'
    },
    {
      title: '总点赞数',
      value: stats.totalLikes,
      icon: HandThumbUpIcon,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverBg: 'hover:bg-purple-100',
      gradient: 'from-purple-500/10 to-purple-600/10',
      trend: '+15%'
    },
    {
      title: '总评论数',
      value: stats.totalComments,
      icon: ChatBubbleLeftIcon,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverBg: 'hover:bg-orange-100',
      gradient: 'from-orange-500/10 to-orange-600/10',
      trend: '+5%'
    }
  ];

  const activityData = [
    { day: '周一', articles: 2, views: 156 },
    { day: '周二', articles: 1, views: 89 },
    { day: '周三', articles: 3, views: 234 },
    { day: '周四', articles: 0, views: 67 },
    { day: '周五', articles: 1, views: 123 },
    { day: '周六', articles: 2, views: 178 },
    { day: '周日', articles: 1, views: 145 }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">加载数据中...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Compact Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        variants={itemVariants}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            仪表板概览
          </h1>
          <p className="text-muted-foreground">
            欢迎回来，查看您的博客统计数据与最新动态
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            to="/admin/editor" 
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <PlusIcon className="h-4 w-4" />
            写新文章
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats cards with reduced spacing */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="group relative overflow-hidden rounded-lg bg-card border border-border/50 p-4 shadow-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -2,
              scale: 1.01,
              transition: { duration: 0.2 }
            }}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <div className="relative flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {card.title}
                </p>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground leading-none">
                    {card.value.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1">
                    <ArrowTrendingUpIcon className="h-3 w-3 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-600">{card.trend}</span>
                    <span className="text-xs text-muted-foreground">本月</span>
                  </div>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-lg ${card.bgColor} ${card.hoverBg} flex items-center justify-center transition-all duration-300 group-hover:scale-110 transform`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Compact two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent articles - takes 2 columns */}
        <motion.div
          className="lg:col-span-2 rounded-lg border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
          variants={itemVariants}
        >
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FireIcon className="h-4 w-4 text-orange-500" />
                  最近文章
                </h2>
                <p className="text-xs text-muted-foreground">最新发布的文章内容</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/admin/articles" 
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors duration-200"
                >
                  查看全部
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="p-4">
            {recentArticles.length === 0 ? (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted/30 flex items-center justify-center">
                  <DocumentTextIcon className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">还没有文章</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                  开始创作您的第一篇文章，分享您的想法和见解
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/admin/editor" 
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-all duration-200"
                  >
                    <PlusIcon className="h-4 w-4" />
                    开始写作
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {recentArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    className="group relative overflow-hidden rounded-lg border border-border/30 bg-card/50 p-4 hover:shadow-sm hover:border-border transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                          {article.title || '无标题'}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {article.excerpt || article.content?.substring(0, 100) + '...' || '暂无内容'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDaysIcon className="h-3 w-3" />
                            <span>{formatDate(article.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <EyeIcon className="h-3 w-3" />
                            <span>{article.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HandThumbUpIcon className="h-3 w-3" />
                            <span>{article.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`
                          inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${article.status === 'published' 
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' 
                            : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                          }
                        `}>
                          {article.status === 'published' ? '已发布' : '草稿'}
                        </span>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link 
                            to={`/admin/editor/${article.id}`}
                            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 hover:bg-accent transition-all duration-200"
                          >
                            编辑
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Compact right sidebar */}
        <div className="space-y-4">
          {/* Drafts section */}
          <motion.div
            className="rounded-lg border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
            variants={itemVariants}
          >
            <div className="p-3 border-b border-border/50">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-amber-500" />
                草稿箱
              </h3>
            </div>
            <div className="p-3">
              {drafts.length === 0 ? (
                <div className="text-center py-4">
                  <DocumentTextIcon className="h-6 w-6 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">暂无草稿</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {drafts.map((draft, index) => (
                    <motion.div
                      key={draft.id}
                      className="group p-2 rounded-md hover:bg-muted/30 transition-colors duration-200 cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <h4 className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {draft.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(draft.updatedAt)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent comments section */}
          <motion.div
            className="rounded-lg border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
            variants={itemVariants}
          >
            <div className="p-3 border-b border-border/50">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ChatBubbleLeftIcon className="h-4 w-4 text-blue-500" />
                最新评论
              </h3>
            </div>
            <div className="p-3">
              {recentComments.length === 0 ? (
                <div className="text-center py-4">
                  <ChatBubbleLeftIcon className="h-6 w-6 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">暂无评论</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentComments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      className="group p-2 rounded-md hover:bg-muted/30 transition-colors duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {comment.author[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground line-clamp-2">
                            {comment.content}
                          </p>
                          <div className="mt-1 text-xs text-muted-foreground">
                            <span className="font-medium">{comment.author}</span>
                            <span className="mx-1">·</span>
                            <span>{formatDate(comment.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Activity chart */}
          <motion.div
            className="rounded-lg border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
            variants={itemVariants}
          >
            <div className="p-3 border-b border-border/50">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ChartBarIcon className="h-4 w-4 text-purple-500" />
                本周活动
              </h3>
            </div>
            <div className="p-3">
              <div className="space-y-1">
                {activityData.map((day, index) => (
                  <motion.div
                    key={day.day}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <span className="text-xs font-medium text-foreground">{day.day}</span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{day.articles} 篇</span>
                      <span>{day.views} 次浏览</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Compact quick actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={itemVariants}
      >
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <Link 
            to="/admin/editor" 
            className="group block rounded-lg border border-border/50 bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <PlusIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                  写新文章
                </h3>
                <p className="text-xs text-muted-foreground">创作新的博客内容和想法</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <Link 
            to="/admin/articles" 
            className="group block rounded-lg border border-border/50 bg-card p-4 shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors duration-200">
                  管理文章
                </h3>
                <p className="text-xs text-muted-foreground">编辑和管理已有的文章内容</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <Link 
            to="/admin/users" 
            className="group block rounded-lg border border-border/50 bg-card p-4 shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300">
                <UserGroupIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-emerald-600 transition-colors duration-200">
                  用户管理
                </h3>
                <p className="text-xs text-muted-foreground">管理用户账户和权限设置</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 