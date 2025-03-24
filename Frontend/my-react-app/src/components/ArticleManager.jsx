import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, FunnelIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { articleAPI } from './api/article/article';

export default function ArticleManager() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticles, setSelectedArticles] = useState([]);
  
  // 分页参数
  const [pageSize] = useState(10); // 每页显示数量
  const [pageNum, setPageNum] = useState(1); // 当前页码
  const [total, setTotal] = useState(0); // 总文章数

  // 选中的文章 ID 列表
  const [selectedIds, setSelectedIds] = useState([]);
  
  // 处理单个文章选中状态
  const handleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 处理全选
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(articles.map(article => article.id));
    } else {
      setSelectedIds([]);
    }
  };

  // 批量删除文章
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    if (!window.confirm(`确定要删除选中的 ${selectedIds.length} 篇文章吗？`)) {
      return;
    }

    try {
      await articleAPI.deleteArticles(selectedIds);
      // 删除成功后刷新列表
      fetchArticles(pageNum);
      // 清空选中状态
      setSelectedIds([]);
    } catch (error) {
      console.error("删除文章失败:", error);
    }
  };

  // 单篇文章删除
  const handleDelete = async (id) => {
    if (!window.confirm("确定要删除这篇文章吗？")) {
      return;
    }

    try {
      await articleAPI.deleteArticles([id]);
      fetchArticles(pageNum);
    } catch (error) {
      console.error("删除文章失败:", error);
    }
  };

  // 获取文章列表
  const fetchArticles = async (page) => {
    setLoading(true);
    try {
      const data = await articleAPI.getArticleList({
        pageNum: page,
        pageSize
      });
      
      setArticles(data.page);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  // 监听页码变化
  useEffect(() => {
    fetchArticles(pageNum);
  }, [pageNum]);

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  // 页码变化处理函数
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNum(newPage);
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 处理编辑
  const handleEdit = (articleId) => {
    navigate(`/admin/editor/${articleId}`);
  };

  // 处理预览并编辑
  const handlePreviewEdit = (articleId) => {
    navigate(`/admin/editor/${articleId}`, { state: { preview: true } });
  };

  // 处理新建文章
  const handleCreate = () => {
    navigate('/admin/editor');
  };

  return (
    <div className="h-full">
      <div className="bg-base-100 rounded-xl shadow-sm h-full flex flex-col">
        {/* 顶部操作栏 */}
        <div className="px-4 lg:px-6 py-4 border-b border-base-200/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-base-content">文章管理</h1>
              <p className="text-sm text-base-content/60 mt-1">管理和编辑您的所有文章</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                className={`btn btn-ghost btn-sm ${selectedIds.length === 0 ? 'btn-disabled' : ''}`}
                onClick={handleBatchDelete}
              >
                批量删除 {selectedIds.length > 0 && `(${selectedIds.length})`}
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleCreate}
              >
                新建文章
              </button>
            </div>
          </div>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="p-4 border-b border-base-200/80">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
                <input 
                  type="text"
                  placeholder="搜索文章..."
                  className="input input-bordered input-sm w-full pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <div className="dropdown dropdown-end">
                <button className="btn btn-ghost btn-sm gap-2">
                  <FunnelIcon className="w-4 h-4" />
                  筛选
                </button>
                <div className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <div className="p-2">
                    <h3 className="font-medium mb-2">发布状态</h3>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="checkbox checkbox-sm" />
                        <span>已发布</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="checkbox checkbox-sm" />
                        <span>草稿</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="flex-1 overflow-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-sm"
                    checked={articles.length > 0 && selectedIds.length === articles.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>文章标题</th>
                <th>状态</th>
                <th>分类</th>
                <th>浏览</th>
                <th>评论</th>
                <th>发布时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-error">
                    {error}
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-sm"
                        checked={selectedIds.includes(article.id)}
                        onChange={() => handleSelect(article.id)}
                      />
                    </td>
                    <td>
                      <div 
                        className="cursor-pointer group"
                        onClick={() => handlePreviewEdit(article.id)}
                      >
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {article.articleTitle}
                        </div>
                        <div className="text-xs text-base-content/60">
                          最后修改：{formatDate(article.createTime)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${article.status === 0 ? 'badge-warning' : 'badge-success'} gap-1`}>
                        {article.status === 0 ? '草稿' : '已发布'}
                      </div>
                    </td>
                    <td>{article.category || '未分类'}</td>
                    <td>{article.visitCount || 0}</td>
                    <td>{article.commentCount || 0}</td>
                    <td>{formatDate(article.createTime)}</td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <button className="btn btn-ghost btn-sm btn-square">
                          <EllipsisHorizontalIcon className="w-5 h-5" />
                        </button>
                        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                          <li>
                            <button 
                              className="w-full text-left"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleEdit(article.id);
                              }}
                            >
                              编辑
                            </button>
                          </li>
                          <li><a>预览</a></li>
                          <li>
                            <button 
                              className="text-error w-full text-left"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(article.id);
                              }}
                            >
                              删除
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="p-4 border-t border-base-200/80">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-sm text-base-content/60 order-2 lg:order-1">
              共 {total} 篇文章
            </div>
            <div className="join order-1 lg:order-2">
              <button 
                className="join-item btn btn-sm"
                onClick={() => handlePageChange(pageNum - 1)}
                disabled={pageNum === 1 || loading}
              >
                «
              </button>
              
              {/* 动态生成页码按钮 */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // 显示当前页码附近的页码和首尾页码
                  return page === 1 || 
                         page === totalPages || 
                         Math.abs(page - pageNum) <= 1;
                })
                .map((page, index, array) => {
                  // 添加省略号
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <button key={`ellipsis-${page}`} className="join-item btn btn-sm btn-disabled">
                        ...
                      </button>
                    );
                  }
                  return (
                    <button
                      key={page}
                      className={`join-item btn btn-sm ${pageNum === page ? 'btn-active' : ''}`}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                    >
                      {page}
                    </button>
                  );
                })}

              <button 
                className="join-item btn btn-sm"
                onClick={() => handlePageChange(pageNum + 1)}
                disabled={pageNum === totalPages || loading}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 