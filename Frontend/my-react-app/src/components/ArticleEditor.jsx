import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Editor from "./Editor";
import { articleAPI } from './api/article/article';
import { 
  EyeIcon, 
  PencilIcon, 
  BookmarkIcon,
  PaperAirplaneIcon,
  TagIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ClockIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(location.state?.preview ? 'preview' : 'edit');
  
  // Breadcrumb data
  const breadcrumbs = [
    { name: '首页', href: '#' },
    { name: '文章管理', href: '/admin/articles' },
    { name: id ? '编辑文章' : '新建文章', current: true }
  ];

  // 预设分类列表
  const [categories] = useState([
    "技术",
    "前端",
    "后端",
    "DevOps",
    "算法",
    "数据库",
    "人工智能",
    "机器学习",
    "云计算",
    "面试",
    "生活",
    "其他"
  ]);
  
  // 文章数据
  const [article, setArticle] = useState({
    articleTitle: "",
    articleContent: "",
    articleSummary: "",
    category: "",
    status: 1
  });

  // 获取文章详情
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const articleData = await articleAPI.getArticle(id);
        setArticle({
          articleTitle: articleData.articleTitle || "",
          articleContent: articleData.articleContent || "",
          articleSummary: articleData.articleSummary || "",
          category: articleData.category || "",
          status: 1,
          id: articleData.id
        });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // 处理文章保存
  const handleSave = async (isDraft = false) => {
    try {
      const articleData = {
        ...article,
        status: isDraft ? 0 : 1
      };

      if (isDraft) {
        if (id) {
          articleData.id = id;
          await articleAPI.saveDraft(articleData);
        } else {
          await articleAPI.saveDraft(articleData);
        }
        alert("草稿保存成功！");
      } else {
        if (id) {
          await articleAPI.updateArticle(articleData);
        } else {
          await articleAPI.createArticle(articleData);
        }
        navigate("/admin/articles");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error saving article:", err);
    }
  };

  // 处理输入变化
  const handleChange = (field) => (value) => {
    setArticle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 切换视图模式
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'edit' ? 'preview' : 'edit');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">加载中...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Breadcrumb */}
      <motion.nav 
        className="flex" 
        aria-label="Breadcrumb"
        variants={item}
      >
        <ol className="flex items-center text-sm text-gray-500">
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
        variants={item}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {id ? "编辑文章" : "创建文章"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {id ? "编辑现有文章内容" : "撰写新的博客文章"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {id && (
            <button 
              onClick={toggleViewMode}
              className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              {viewMode === 'edit' ? (
                <>
                  <EyeIcon className="w-4 h-4" />
                  预览
                </>
              ) : (
                <>
                  <PencilIcon className="w-4 h-4" />
                  编辑
                </>
              )}
            </button>
          )}
          <button 
            onClick={() => handleSave(true)}
            className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <BookmarkIcon className="w-4 h-4" />
            保存草稿
          </button>
          <button 
            onClick={() => handleSave(false)}
            className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            {id ? "保存修改" : "发布文章"}
          </button>
        </div>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div 
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-red-800 text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-4 gap-6"
        variants={item}
      >
        {/* Article Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Title Input */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章标题
            </label>
            <input
              type="text"
              placeholder="请输入文章标题..."
              value={article.articleTitle}
              onChange={(e) => handleChange('articleTitle')(e.target.value)}
              className="w-full text-2xl font-semibold text-gray-900 placeholder-gray-400 border-0 focus:ring-0 p-0 bg-transparent"
            />
          </div>

          {/* Content Editor/Preview */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5" />
                {viewMode === 'edit' ? '内容编辑' : '预览模式'}
              </h3>
            </div>
            
            <div className="min-h-[500px]">
              {viewMode === 'edit' ? (
                <div className="p-6">
                  <Editor
                    content={article.articleContent}
                    onChange={handleChange('articleContent')}
                    placeholder="开始写作..."
                  />
                </div>
              ) : (
                <div className="p-6 prose prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {article.articleContent || "开始写作以查看预览..."}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="xl:col-span-1 space-y-6">
          {/* Article Settings */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Cog6ToothIcon className="h-5 w-5" />
              文章设置
            </h3>
            
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类
                </label>
                <select
                  value={article.category}
                  onChange={(e) => handleChange('category')(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">选择分类</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  文章摘要
                </label>
                <textarea
                  placeholder="输入文章摘要..."
                  value={article.articleSummary}
                  onChange={(e) => handleChange('articleSummary')(e.target.value)}
                  rows="4"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleSave(true)}
                className="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-left flex items-center gap-3"
              >
                <BookmarkIcon className="h-4 w-4" />
                保存为草稿
              </button>
              <button 
                onClick={() => handleSave(false)}
                className="w-full bg-indigo-50 text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium text-left flex items-center gap-3"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
                立即发布
              </button>
              <button 
                onClick={() => navigate('/admin/articles')}
                className="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-left flex items-center gap-3"
              >
                <DocumentTextIcon className="h-4 w-4" />
                返回列表
              </button>
            </div>
          </div>

          {/* Article Statistics (if editing) */}
          {id && (
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">文章统计</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">字数统计</span>
                  <span className="font-medium text-gray-900">
                    {article.articleContent.length.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">创建时间</span>
                  <span className="font-medium text-gray-900">今天</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">最后修改</span>
                  <span className="font-medium text-gray-900">刚刚</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 