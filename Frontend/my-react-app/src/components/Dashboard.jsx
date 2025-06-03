import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  EyeIcon,  
  ChartBarIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilSquareIcon,
  HeartIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    users: 1234,
    articles: 567,
    views: 89012,
    likes: 3456
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

  // Breadcrumb data
  const breadcrumbs = [
    { name: '首页', href: '#' },
    { name: 'Dashboard', current: true }
  ];

  // Stats configuration
  const statsConfig = [
    {
      name: '用户总数',
      value: stats.users.toLocaleString(),
      change: '+12%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'indigo'
    },
    {
      name: '文章数量',
      value: stats.articles.toLocaleString(),
      change: '+8%',
      changeType: 'increase',
      icon: DocumentTextIcon,
      color: 'green'
    },
    {
      name: '总浏览量',
      value: stats.views.toLocaleString(),
      change: '+24%',
      changeType: 'increase',
      icon: EyeIcon,
      color: 'blue'
    },
    {
      name: '点赞数',
      value: stats.likes.toLocaleString(),
      change: '-2%',
      changeType: 'decrease',
      icon: HeartIcon,
      color: 'red'
    }
  ];

  // Recent activities data
  const recentActivities = [
    { id: 1, action: '新用户注册', user: '张三', time: '2 分钟前' },
    { id: 2, action: '发布文章', user: '李四', time: '5 分钟前' },
    { id: 3, action: '文章获得点赞', user: '王五', time: '10 分钟前' },
    { id: 4, action: '用户留言', user: '赵六', time: '15 分钟前' },
    { id: 5, action: '文章被分享', user: '孙七', time: '20 分钟前' }
  ];

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
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">加载数据中...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumb */}
      <motion.nav 
        className="flex" 
        aria-label="Breadcrumb"
        variants={itemVariants}
      >
        <ol className="flex items-center space-x-1 text-sm text-gray-500">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.name} className="flex items-center">
              {index > 0 && (
                <svg className="flex-shrink-0 h-4 w-4 text-gray-300 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {crumb.current ? (
                <span className="font-medium text-gray-900">{crumb.name}</span>
              ) : (
                <a href={crumb.href} className="hover:text-gray-700 transition-colors">
                  {crumb.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </motion.nav>

      {/* Page Header */}
      <motion.div 
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            欢迎回来！这里是您的管理面板概览
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 text-sm font-medium">
            <ChartBarIcon className="h-4 w-4" />
            导出报告
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.name}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs 上月</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">用户增长趋势</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">图表数据加载中...</p>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">内容分类统计</h3>
            <ChartPieIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartPieIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">图表数据加载中...</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activities and Quick Actions */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">最近活动</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">快速操作</h3>
          <div className="space-y-3">
            <button className="w-full bg-indigo-50 text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium text-left flex items-center gap-3">
              <PencilSquareIcon className="h-4 w-4" />
              写新文章
            </button>
            <button className="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-left flex items-center gap-3">
              <UserGroupIcon className="h-4 w-4" />
              用户管理
            </button>
            <button className="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-left flex items-center gap-3">
              <DocumentTextIcon className="h-4 w-4" />
              文章管理
            </button>
            <button className="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-left flex items-center gap-3">
              <ChartBarIcon className="h-4 w-4" />
              数据统计
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 