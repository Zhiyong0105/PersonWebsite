import { useState } from 'react';
import { formatTime } from '../utils/formatTime';
import { FiSend, FiCornerDownRight } from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { articleAPI } from './api/article/article';

export default function CommentItem({ 
  comment, 
  articleId, 
  onReplySuccess, 
  isLoggedIn, 
  onLoginClick,
  level = 0,
  maxLevel = 2  // 限制为两层
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 处理回复提交
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await articleAPI.addComment({
        type: 1,
        typeId: articleId,
        parentId: level === 0 ? comment.id : comment.parentId, // 始终回复到一级评论
        commentContent: replyContent.trim(),
        replyToUserId: comment.commentUserId  // 添加回复目标用户ID
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

  // 处理回复按钮点击
  const handleReplyClick = () => {
    if (!isLoggedIn) {
      onLoginClick?.();
      return;
    }
    setShowReplyInput(!showReplyInput);
    // 设置默认的回复内容，包含 @ 用户名
    if (!showReplyInput) {
      setReplyContent(`@${comment.commentUserId} `);
    }
  };

  // 处理点赞
  const handleLike = () => {
    if (!isLoggedIn) {
      onLoginClick?.();
      return;
    }
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    // 这里可以添加实际的点赞API调用
  };

  // 处理评论内容显示，支持 @ 标记
  const renderCommentContent = () => {
    if (level === 0) {
      return comment.commentContent;
    }
    
    // 如果是二级评论，检查内容是否已经包含"回复@"
    const hasReplyPrefix = comment.commentContent.startsWith('回复@');
    if (!hasReplyPrefix) {
      // 检查内容是否以@开头
      const hasAtPrefix = comment.commentContent.startsWith('@');
      if (hasAtPrefix) {
        // 如果已经有@，直接在前面加上"回复"
        return `回复${comment.commentContent}`;
      } else if (comment.replyToUserId) {
        // 如果没有@，添加完整的"回复@用户"
        return `回复@${comment.replyToUserId} ${comment.commentContent}`;
      }
    }
    return comment.commentContent;
  };

  return (
    <div className={`comment-item ${level > 0 ? 'pl-12 relative' : 'border-bottom pb-4'}`}>
      {/* 评论主体 */}
      <div className="flex gap-3">
        {/* 回复线条 */}
        {level > 0 && (
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gray-100"></div>
        )}

        {/* 回复箭头指示器 */}
        {level > 0 && (
          <div className="absolute left-6 top-4 w-5 h-[1px] bg-gray-100"></div>
        )}

        <div className="avatar flex-shrink-0">
          <div className={`rounded-full ${level > 0 ? 'w-8 h-8' : 'w-10 h-10'} border-2 border-white shadow-sm`}>
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.commentUserId}`}
              alt="avatar" 
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${level > 0 ? 'text-sm' : ''} text-pink-500`}>
              用户 {comment.commentUserId}
            </span>
            <span className="text-xs text-gray-400">
              {formatTime(comment.createTime)}
            </span>
          </div>
          
          <p className={`mt-1.5 text-gray-700 break-words ${level > 0 ? 'text-sm' : ''}`}>
            {renderCommentContent()}
          </p>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-4 mt-2">
            <button 
              className={`
                text-xs flex items-center gap-1 
                ${liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'} 
                transition-colors
              `}
              onClick={handleLike}
            >
              {liked ? <FaHeart className="w-3.5 h-3.5" /> : <FaRegHeart className="w-3.5 h-3.5" />}
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>
            
            <button 
              className="text-xs text-gray-400 hover:text-pink-500 transition-colors"
              onClick={handleReplyClick}
            >
              {showReplyInput ? '取消回复' : '回复'}
            </button>
            
            {/* 只在第一层显示展开按钮 */}
            {level === 0 && comment.childCommentCount > 0 && (
              <button 
                className="text-xs text-pink-500 hover:text-pink-600 transition-colors"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? '收起回复' : `查看回复(${comment.childCommentCount})`}
              </button>
            )}
          </div>

          {/* 回复输入框 */}
          {showReplyInput && (
            <form onSubmit={handleReply} className="mt-3 flex gap-2 items-center">
              <input
                type="text"
                className="flex-1 px-3 py-1.5 text-sm rounded-full border border-gray-200 focus:border-pink-300 focus:outline-none"
                placeholder={`回复 @${comment.commentUserId}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!replyContent.trim() || isSubmitting}
                className={`
                  px-3 py-1.5 rounded-full text-sm
                  bg-pink-500 text-white
                  flex items-center gap-1
                  ${(!replyContent.trim() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600'}
                `}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <FiSend className="w-3 h-3" />
                )}
                {isSubmitting ? '发送中' : '发布'}
              </button>
            </form>
          )}

          {/* 子评论区域 - 只在第一层显示 */}
          {level === 0 && showReplies && comment.childComments?.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.childComments.map(reply => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply}
                  articleId={articleId}
                  onReplySuccess={onReplySuccess}
                  isLoggedIn={isLoggedIn}
                  onLoginClick={onLoginClick}
                  level={1}
                  maxLevel={maxLevel}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}