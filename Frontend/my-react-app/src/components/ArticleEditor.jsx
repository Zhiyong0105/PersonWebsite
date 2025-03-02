import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Editor from "./Editor";
import { articleAPI } from './api/article/article';
import { XMarkIcon, PlusIcon, EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [viewMode, setViewMode] = useState(location.state?.preview ? 'preview' : 'edit');
  
  // 文章数据
  const [article, setArticle] = useState({
    articleTitle: "",
    articleContent: "",
    articleSummary: "",
    category: "",
    tags: [],
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
        // 确保所有字段都有默认值
        setArticle({
          articleTitle: articleData.articleTitle || "",
          articleContent: articleData.articleContent || "",
          articleSummary: articleData.articleSummary || "",
          category: articleData.category || "",
          tags: articleData.tags || [],
          status: 1,
          id: articleData.id // 保存文章ID
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
        status: 1
      };

      if (id) {
        await articleAPI.updateArticle(articleData);
      } else {
        await articleAPI.createArticle(articleData);
      }

      navigate("/admin/articles");
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

  // 添加标签
  const addTag = () => {
    if (!categoryInput.trim()) return;
    
    // 检查是否已存在相同标签
    if (!article.tags.includes(categoryInput.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, categoryInput.trim()]
      }));
    }
    
    setCategoryInput("");
  };

  // 删除标签
  const removeTag = (tagToRemove) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 处理按键事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // 切换视图模式
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'edit' ? 'preview' : 'edit');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[calc(100vh-2rem)]">
      <div className="bg-base-100 rounded-xl shadow-sm h-full flex flex-col">
        {/* 顶部操作栏 */}
        <div className="px-4 lg:px-6 py-4 border-b border-base-200/80 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-base-content">
                {id ? "编辑文章" : "创建文章"}
              </h1>
              <p className="text-sm text-base-content/60 mt-1">
                {id ? "编辑现有文章" : "撰写新的博客文章"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {id && (
                <button 
                  className="btn btn-outline btn-sm gap-2"
                  onClick={toggleViewMode}
                >
                  {viewMode === 'edit' ? (
                    <>
                      <EyeIcon className="w-4 h-4" />
                      预览模式
                    </>
                  ) : (
                    <>
                      <PencilIcon className="w-4 h-4" />
                      编辑模式
                    </>
                  )}
                </button>
              )}
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => handleSave(true)}
              >
                保存草稿
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => handleSave(false)}
              >
                {id ? "保存修改" : "发布文章"}
              </button>
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="alert alert-error mx-4 mt-4">
            <button 
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => setError(null)}
            >
              ✕
            </button>
            {error}
          </div>
        )}

        {/* 编辑器和设置区域 */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex lg:flex-row flex-col gap-4 lg:gap-6">
            {/* 主编辑区域 */}
            <div className="flex-1 p-4 lg:p-6 overflow-auto">
              {viewMode === 'edit' ? (
                <div className="bg-base-100 rounded-lg h-auto min-h-full p-6">
                  <div className="max-w-4xl mx-auto">
                    {/* 文章标题输入框 - 仅在编辑模式显示 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">文章标题</label>
                      <input
                        type="text"
                        className="input input-bordered w-full text-xl font-bold"
                        value={article.articleTitle}
                        onChange={(e) => handleChange('articleTitle')(e.target.value)}
                        placeholder="请输入文章标题..."
                      />
                    </div>
                    
                    {/* 文章摘要输入框 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">文章摘要</label>
                      <textarea
                        className="textarea textarea-bordered w-full h-24"
                        value={article.articleSummary}
                        onChange={(e) => handleChange('articleSummary')(e.target.value)}
                        placeholder="请输入文章摘要..."
                      />
                    </div>
                    
                    {/* Markdown 编辑器 */}
                    <div>
                      <label className="block text-sm font-medium mb-2">文章内容</label>
                      <Editor
                        value={article.articleContent}
                        onChange={handleChange('articleContent')}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-base-100 rounded-lg h-auto min-h-full">
                  <div className="p-6 max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">{article.articleTitle}</h1>
                    
                    {/* 文章摘要 */}
                    {article.articleSummary && (
                      <div className="bg-base-200 p-4 rounded-lg mb-6 text-base-content/80 italic">
                        {article.articleSummary}
                      </div>
                    )}
                    
                    {/* 文章元数据 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.category && (
                        <div className="badge badge-outline">
                          {article.category}
                        </div>
                      )}
                      {article.tags && article.tags.map((tag, index) => (
                        <div key={index} className="badge badge-primary badge-outline">
                          {tag}
                        </div>
                      ))}
                    </div>
                    
                    {/* 文章内容预览 */}
                    <div className="prose prose-lg max-w-none">
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
                        {article.articleContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 侧边设置面板 */}
            <div className={`
              lg:w-80 w-full bg-base-100 p-4
              lg:relative fixed bottom-0 left-0 right-0
              transform transition-transform duration-300
              ${isSettingsPanelOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
              z-20 lg:z-0 shadow-lg lg:shadow-none
              overflow-y-auto
            `}>
              {/* 移动端折叠按钮 */}
              <button 
                className="lg:hidden absolute -left-10 top-4 btn btn-circle btn-sm btn-ghost bg-base-100"
                onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform duration-300 ${isSettingsPanelOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* 文章设置面板 */}
              <div className="collapse collapse-arrow bg-base-100 rounded-lg border border-base-200">
                <input type="checkbox" defaultChecked /> 
                <div className="collapse-title p-4 min-h-0 py-3">
                  <h3 className="text-sm font-medium">文章设置</h3>
                </div>
                <div className="collapse-content px-4 pb-4">
                  <div className="space-y-4">
                    {/* 分类输入框 */}
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text">分类</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm"
                        value={article.category}
                        onChange={(e) => handleChange('category')(e.target.value)}
                        placeholder="输入分类"
                      />
                    </div>

                    {/* 标签输入区域 */}
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text">标签</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input input-bordered input-sm flex-1"
                          value={categoryInput}
                          onChange={(e) => setCategoryInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="输入标签后按回车"
                        />
                        <button 
                          className="btn btn-sm btn-square"
                          onClick={addTag}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* 标签展示区域 */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {article.tags.map((tag, index) => (
                          <div 
                            key={index} 
                            className="badge badge-primary gap-1 py-3"
                          >
                            {tag}
                            <button 
                              className="btn btn-xs btn-circle btn-ghost"
                              onClick={() => removeTag(tag)}
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {article.tags.length === 0 && (
                          <div className="text-sm text-base-content/60 italic">
                            暂无标签
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 移动端遮罩层 */}
            {isSettingsPanelOpen && (
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
                onClick={() => setIsSettingsPanelOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 