import { useState, useEffect } from 'react';
import { articleAPI } from './api/article/article';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaRegCommentDots } from "react-icons/fa";
import CommentItem from './CommentItem';
import CommentBox from './CommentBox';
import LoginModal from './LoginModal';

export default function Comments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

      // 第一次遍历：初始化所有评论
      data.page.forEach(comment => {
        // 深拷贝评论对象，避免直接修改原始数据
        const commentCopy = { ...comment, children: [] };
        commentMap.set(comment.id, commentCopy);
      });

      // 第二次遍历：构建父子关系
      data.page.forEach(comment => {
        const commentCopy = commentMap.get(comment.id);
        if (comment.parentId && commentMap.has(comment.parentId)) {
          // 如果有父评论，添加到父评论的 children 中
          const parentComment = commentMap.get(comment.parentId);
          parentComment.children.push(commentCopy);
          // 更新父评论的子评论数量
          parentComment.childCommentCount = (parentComment.childCommentCount || 0) + 1;
        } else {
          // 如果没有父评论或父评论不在当前页面，作为根评论
          rootComments.push(commentCopy);
        }
      });

      // 按时间倒序排序根评论
      rootComments.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

      // 递归排序所有子评论
      const sortComments = (comments) => {
        comments.forEach(comment => {
          if (comment.children?.length > 0) {
            comment.children.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            sortComments(comment.children);
          }
        });
      };

      sortComments(rootComments);

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

  // 检查登录状态
  const isLoggedIn = !!localStorage.getItem('token');

  // 处理登录点击
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  // 处理登录成功
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // 触发登录状态改变事件
    window.dispatchEvent(new Event('loginStateChanged'));
    // 刷新评论列表
    fetchComments(pageNum);
  };

  useEffect(() => {
    // 监听登录成功事件
    const handleLoginSuccess = () => {
      fetchComments(pageNum);
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, [pageNum]);

  return (
    <div className="mt-8 pt-8">
      {/* 评论统计 */}
      <div className="flex items-center mb-6">
        <FaRegCommentDots className="text-pink-500 mr-2 text-xl" />
        <h2 className="text-lg font-bold text-gray-800">评论</h2>
        <span className="text-gray-400 ml-2 text-sm">({total})</span>
      </div>

      {/* 评论框 */}
      <div className="mb-8">
        <CommentBox
          onSubmit={() => fetchComments(1)}
          isLoggedIn={isLoggedIn}
          onLoginClick={handleLoginClick}
          articleId={articleId}
        />
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading loading-spinner loading-lg text-pink-500"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              articleId={articleId}
              onReplySuccess={() => fetchComments(pageNum)}
              onLoginClick={handleLoginClick}
              isLoggedIn={isLoggedIn}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg">
            暂无评论，快来抢沙发吧~
          </div>
        )}
      </div>

      {/* 分页 */}
      {total > pageSize && (
        <div className="flex justify-center mt-8">
          <div className="flex rounded-full bg-gray-50 p-1">
            <button
              className={`
                px-3 py-1.5 rounded-full text-sm flex items-center
                ${pageNum === 1 || loading 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
              onClick={() => setPageNum(prev => Math.max(1, prev - 1))}
              disabled={pageNum === 1 || loading}
            >
              <IoChevronBack className="w-4 h-4 mr-1" />
              上一页
            </button>
            <div className="px-3 py-1.5 text-sm text-gray-500">
              {pageNum}/{Math.ceil(total / pageSize)}
            </div>
            <button
              className={`
                px-3 py-1.5 rounded-full text-sm flex items-center
                ${pageNum === Math.ceil(total / pageSize) || loading 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
              onClick={() => setPageNum(prev => Math.min(Math.ceil(total / pageSize), prev + 1))}
              disabled={pageNum === Math.ceil(total / pageSize) || loading}
            >
              下一页
              <IoChevronForward className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* 登录模态框 */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
} 