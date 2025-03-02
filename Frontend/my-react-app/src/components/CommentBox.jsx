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
              <div 
                className={`
                  relative group cursor-pointer
                  bg-white/95 backdrop-blur-[2px] 
                  rounded-lg p-6 
                  border border-gray-100
                  transition-all duration-300
                  hover:border-pink-200 hover:shadow-md
                  active:scale-95
                  max-w-[280px] mx-auto
                  ${isClicking ? 'scale-95' : 'scale-100'}
                `}
                onClick={handleLoginClick}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-full 
                    bg-pink-50
                    flex items-center justify-center
                    group-hover:scale-110 
                    transition-transform duration-300
                    ${isClicking ? 'scale-90' : ''}
                  `}>
                    <FiLock className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-800">
                      登录后参与讨论
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      点击登录，发表评论
                    </p>
                  </div>
                </div>
                
                {/* 悬浮效果装饰 */}
                <div className={`
                  absolute inset-0 
                  border border-pink-200 rounded-lg 
                  opacity-0
                  group-hover:opacity-100
                  transition-all duration-300
                  ${isClicking ? 'scale-90' : 'scale-100'}
                `}/>
              </div>
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