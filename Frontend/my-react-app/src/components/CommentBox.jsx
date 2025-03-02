import { useState } from 'react';
import { FiSend, FiLock } from "react-icons/fi";
import { articleAPI } from './api/article/article';

export default function CommentBox({ onSubmit, isLoggedIn, onLoginClick, articleId }) {
  const [content, setContent] = useState('');
  const [isClicking, setIsClicking] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await articleAPI.addComment({
        type: 1,
        typeId: articleId,
        commentContent: content.trim()
      });

      // 清空内容
      setContent('');
      // 通知父组件刷新评论列表
      onSubmit();
      
    } catch (error) {
      console.error('Failed to add comment:', error);
      // 这里可以添加错误提示
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginClick = () => {
    setIsClicking(true);
    onLoginClick?.();
    setTimeout(() => setIsClicking(false), 300);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            className={`
              w-full min-h-[100px] p-4 
              bg-white resize-none
              border-none outline-none
              transition-all duration-200
              text-gray-700 placeholder:text-gray-400 text-sm
              ${!isLoggedIn ? 'cursor-not-allowed opacity-75 hover:opacity-100' : ''}
              ${isSubmitting ? 'opacity-50' : ''}
            `}
            placeholder={isLoggedIn ? "发一条友善的评论" : "登录后参与评论讨论"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!isLoggedIn || isSubmitting}
          />
          
          {!isLoggedIn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={handleLoginClick}
                className={`
                  flex items-center gap-2 px-4 py-2
                  bg-pink-50 hover:bg-pink-100
                  text-pink-500 font-medium
                  rounded-full border border-pink-200
                  transition-all duration-200
                  ${isClicking ? 'scale-95' : 'scale-100'}
                `}
                type="button"
              >
                <FiLock className="w-4 h-4" />
                点击登录后发表评论
              </button>
            </div>
          )}
        </div>

        {isLoggedIn && (
          <div className="flex justify-end p-3 bg-gray-50 border-t border-gray-100">
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className={`
                px-4 py-1.5 rounded-full
                bg-pink-500 text-white text-sm
                flex items-center gap-1.5
                hover:bg-pink-600
                transition-all duration-200
                ${(!content.trim() || isSubmitting)
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-sm'
                }
              `}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FiSend className="w-3.5 h-3.5" />
              )}
              {isSubmitting ? '发送中...' : '发布'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
} 