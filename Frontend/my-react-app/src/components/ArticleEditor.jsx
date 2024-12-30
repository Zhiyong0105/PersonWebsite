import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "./Axios";
import Editor from "./Editor";

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 文章数据
  const [article, setArticle] = useState({
    articleTitle: "",
    articleContent: "",
    articleSummary: "",
    category: "",
    status: "public"
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
        const response = await axiosInstance.get(`/article/${id}`);
        if (response.data.code === 200) {
          const articleData = response.data.data;
          // 确保所有字段都有默认值
          setArticle({
            articleTitle: articleData.articleTitle || "",
            articleContent: articleData.articleContent || "",
            articleSummary: articleData.articleSummary || "",
            category: articleData.category || "",
            status: articleData.status || "public",
            id: articleData.id // 保存文章ID
          });
        } else {
          throw new Error(response.data.msg || "Failed to fetch article");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]); // 依赖于 id 参数

  // 处理文章保存
  const handleSave = async (isDraft = false) => {
    try {
      const articleData = {
        ...article,
        status: isDraft ? 'draft' : 'public'
      };

      const response = await axiosInstance[id ? 'put' : 'post'](
        id ? '/article/auth/back/update' : '/article/auth/back/create',
        articleData
      );

      if (response.data.code === 200) {
        navigate("/admin/articles");
      } else {
        throw new Error(response.data.msg || "Failed to save article");
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
              <div className="bg-base-100 rounded-lg h-auto min-h-full">
                <Editor
                  value={article.articleContent}
                  onChange={handleChange('articleContent')}
                />
              </div>
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
                  <div className="space-y-3">
                    {/* 标题输入框 */}
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text">文章标题</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm"
                        value={article.articleTitle}
                        onChange={(e) => handleChange('articleTitle')(e.target.value)}
                        placeholder="输入文章标题"
                      />
                    </div>

                    {/* 摘要输入框 */}
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text">文章摘要</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered text-sm"
                        value={article.articleSummary}
                        onChange={(e) => handleChange('articleSummary')(e.target.value)}
                        placeholder="输入文章摘要"
                        rows={3}
                      />
                    </div>

                    {/* 发布状态 */}
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text">发布状态</span>
                      </label>
                      <select 
                        className="select select-bordered select-sm w-full"
                        value={article.status}
                        onChange={(e) => handleChange('status')(e.target.value)}
                      >
                        <option value="public">公开发布</option>
                        <option value="private">私密发布</option>
                        <option value="draft">草稿</option>
                      </select>
                    </div>

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