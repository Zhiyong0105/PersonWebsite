import { useState, useEffect } from 'react';
import { articleAPI } from './api/article/article';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import CommentItem from './CommentItem';

export default function Comments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 获取评论列表
  const fetchComments = async (page) => {
    setLoading(true);
    try {
      const data = await articleAPI.getComments({ 
        type: 1,
        typeId: articleId,
        pageNum: page, 
        pageSize 
      });
      
      // 处理评论数据，构建父子关系
const commentMap = new Map();
const rootComments = [];

// 将所有评论放入 Map 中，并初始化 children 数组
data.page.forEach(comment => {
  comment.children = [];
  commentMap.set(comment.id, comment);
});

// 构建父子关系
data.page.forEach(comment => {
  if (comment.parentId && commentMap.has(comment.parentId)) {
    // 如果有有效的父评论，将当前评论添加到父评论的 children 中
    commentMap.get(comment.parentId).children.push(comment);
  } else {
    // 如果没有父评论或父评论无效，则视为根评论
    rootComments.push(comment);
  }
});

      setComments(rootComments);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加评论
  const handleAddComment = async (content, parentId = null) => {
    try {
      await articleAPI.addComment({
        typeId: articleId,
        type: 0,
        content,
        parentId
      });
      // 刷新评论列表，回到第一页
      setPageNum(1);
      await fetchComments(1);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  useEffect(() => {
    fetchComments(pageNum);
  }, [articleId, pageNum]);

  return (
    <div className="mt-8 border-t pt-8">
      {/* 评论统计 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">评论 ({total})</h2>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              onReply={handleAddComment}
              depth={0}
            />
          ))
        ) : (
          <div className="text-center py-8 text-base-content/60">
            暂无评论，来说两句吧~
          </div>
        )}
      </div>

      {/* 分页 */}
      {total > pageSize && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => setPageNum(prev => Math.max(1, prev - 1))}
              disabled={pageNum === 1 || loading}
            >
              <IoChevronBack className="w-4 h-4" />
              上一页
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={() => setPageNum(prev => Math.min(Math.ceil(total / pageSize), prev + 1))}
              disabled={pageNum === Math.ceil(total / pageSize) || loading}
            >
              下一页
              <IoChevronForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 