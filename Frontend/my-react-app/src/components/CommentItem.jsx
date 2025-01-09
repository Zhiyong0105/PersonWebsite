import { useState } from 'react';
import { formatTime } from '../utils/formatTime';
import { FiSend } from "react-icons/fi";
import { articleAPI } from './api/article/article';

export default function CommentItem({ comment, articleId, onReplySuccess }) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理回复提交
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await articleAPI.addComment({
        type: 1,
        typeId: articleId,
        parentId: comment.id,
        commentContent: replyContent.trim()
      });

      // 清空内容并隐藏回复框
      setReplyContent('');
      setShowReplyInput(false);
      // 通知父组件刷新评论列表
      onReplySuccess?.();
      
    } catch (error) {
      console.error('Failed to add reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-item">
      {/* 评论主体 */}
      <div className="flex gap-4">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.commentUserId}`}
              alt="avatar" 
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">用户 {comment.commentUserId}</span>
            <span className="text-sm text-base-content/50">
              {formatTime(comment.createTime)}
            </span>
          </div>
          <p className="mt-2 text-base-content/90">{comment.commentContent}</p>
          
          {/* 回复按钮和回复数量 */}
          <div className="flex items-center gap-4 mt-2">
            <button 
              className="text-sm text-base-content/60 hover:text-primary transition-colors"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              {showReplyInput ? '取消回复' : '回复'}
            </button>
            {comment.childCommentCount > 0 && (
              <button 
                className="text-sm text-primary hover:text-primary/80 transition-colors"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? '收起回复' : `查看 ${comment.childCommentCount} 条回复`}
              </button>
            )}
          </div>

          {/* 回复输入框 */}
          {showReplyInput && (
            <form onSubmit={handleReply} className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 input input-bordered input-sm focus:input-primary"
                  placeholder="回复评论..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!replyContent.trim() || isSubmitting}
                  className={`
                    btn btn-primary btn-sm gap-2
                    ${(!replyContent.trim() || isSubmitting) ? 'opacity-50' : ''}
                  `}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <FiSend className="w-4 h-4" />
                  )}
                  {isSubmitting ? '发送中' : '回复'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 子评论区域 */}
      {showReplies && comment.childComments && (
        <div className="ml-14 mt-4 space-y-4 border-l-2 border-base-200/50 pl-4">
          {comment.childComments.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply}
              articleId={articleId}
              onReplySuccess={onReplySuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
} 