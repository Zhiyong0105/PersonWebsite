import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, FunnelIcon, EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
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
    <motion.div 
      className="space-y-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with New Article button moved to top left */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-4">
          <motion.button 
            className="inline-flex items-center justify-center rounded-md border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors gap-2"
            onClick={handleCreate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusIcon className="h-4 w-4" />
            新建文章
          </motion.button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              文章管理
            </h1>
            <p className="text-muted-foreground mt-1">
              管理和编辑您的所有文章
            </p>
          </div>
        </div>
        
        {selectedIds.length > 0 && (
          <motion.button 
            className="inline-flex items-center justify-center rounded-md border border-destructive bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors gap-2"
            onClick={handleBatchDelete}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            批量删除 ({selectedIds.length})
          </motion.button>
        )}
      </motion.div>

      {/* Search and filter */}
      <motion.div 
        className="rounded-lg border bg-card text-card-foreground shadow-sm p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索文章标题或内容..."
              className="flex h-9 w-full rounded-md border border-input bg-background px-10 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex items-center gap-3">
            <FunnelIcon className="h-4 w-4 text-muted-foreground" />
            <select 
              className="flex h-9 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">全部状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>总文章: {total}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>已发布: {articles.filter(a => a.status === 1).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span>草稿: {articles.filter(a => a.status === 0).length}</span>
          </div>
        </div>
      </motion.div>

      {/* Article table with full-width container and enhanced styling */}
      <motion.div 
        className="w-full rounded-lg border bg-card shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">
                  <input 
                    type="checkbox" 
                    className="rounded border-input"
                    checked={articles.length > 0 && selectedIds.length === articles.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">文章标题</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">状态</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">分类</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">浏览</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">评论</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">发布时间</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <motion.div 
                      className="flex flex-col items-center gap-3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin"></div>
                      <p className="text-sm text-muted-foreground">加载文章数据中...</p>
                    </motion.div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <div className="text-center">
                      <p className="text-destructive font-medium mb-2">{error}</p>
                      <button 
                        className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                        onClick={() => fetchArticles(pageNum)}
                      >
                        重试
                      </button>
                    </div>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted/30 flex items-center justify-center">
                        <PlusIcon className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">还没有文章</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                        开始创作您的第一篇文章，分享您的想法和见解
                      </p>
                      <motion.button 
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-all duration-200"
                        onClick={handleCreate}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <PlusIcon className="h-4 w-4" />
                        开始写作
                      </motion.button>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                articles.map((article, index) => (
                  <motion.tr 
                    key={article.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors duration-200 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(var(--muted) / 0.3)" }}
                  >
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-input"
                        checked={selectedIds.includes(article.id)}
                        onChange={() => handleSelect(article.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div 
                        className="cursor-pointer group-hover:text-primary transition-colors duration-200"
                        onClick={() => handlePreviewEdit(article.id)}
                      >
                        <div className="font-medium text-foreground line-clamp-1">
                          {article.articleTitle}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          最后修改：{formatDate(article.createTime)}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`
                        inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                        ${article.status === 0 
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' 
                          : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                        }
                      `}>
                        {article.status === 0 ? '草稿' : '已发布'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{article.category || '未分类'}</td>
                    <td className="p-4 text-sm text-muted-foreground">{article.visitCount || 0}</td>
                    <td className="p-4 text-sm text-muted-foreground">{article.commentCount || 0}</td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(article.createTime)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <motion.button 
                          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(article.id);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          编辑
                        </motion.button>
                        <motion.button 
                          className="inline-flex items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(article.id);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          删除
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {!loading && !error && articles.length > 0 && (
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 rounded-lg border bg-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="text-sm text-muted-foreground">
            共 {total} 篇文章，第 {pageNum} 页，共 {totalPages} 页
          </div>
          <div className="flex items-center gap-2">
            <motion.button 
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(pageNum - 1)}
              disabled={pageNum === 1 || loading}
              whileHover={{ scale: pageNum === 1 ? 1 : 1.05 }}
              whileTap={{ scale: pageNum === 1 ? 1 : 0.95 }}
            >
              上一页
            </motion.button>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return page === 1 || 
                         page === totalPages || 
                         Math.abs(page - pageNum) <= 1;
                })
                .map((page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-2 py-1 text-sm text-muted-foreground">
                        ...
                      </span>
                    );
                  }
                  return (
                    <motion.button
                      key={page}
                      className={`
                        inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                        ${pageNum === page 
                          ? 'bg-primary text-primary-foreground' 
                          : 'border border-border bg-background text-foreground hover:bg-accent'
                        }
                      `}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {page}
                    </motion.button>
                  );
                })}
            </div>

            <motion.button 
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(pageNum + 1)}
              disabled={pageNum === totalPages || loading}
              whileHover={{ scale: pageNum === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: pageNum === totalPages ? 1 : 0.95 }}
            >
              下一页
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 