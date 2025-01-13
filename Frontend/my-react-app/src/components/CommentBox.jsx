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
    <div className="bg-base-200/50 rounded-xl p-4 sm:p-6">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            className={`
              w-full min-h-[120px] p-4 rounded-lg
              bg-base-100 resize-none
              border border-base-300 focus:border-primary
              transition-all duration-200
              text-base-content/80 placeholder:text-base-content/50
              ${!isLoggedIn ? 'cursor-not-allowed opacity-75 hover:opacity-100' : ''}
              ${isSubmitting ? 'opacity-50' : ''}
            `}
            placeholder={isLoggedIn ? "写下你的想法..." : "登录后参与评论讨论"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!isLoggedIn || isSubmitting}
          />
          
          {!isLoggedIn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className={`
                  relative group cursor-pointer
                  bg-base-100/95 backdrop-blur-[2px] 
                  rounded-lg p-6 
                  border border-base-20
                  transition-all duration-300
                  hover:border-primary/30 hover:shadow-lg
                  active:scale-95
                  max-w-[280px] mx-auto
                  ${isClicking ? 'scale-95' : 'scale-100'}
                `}
                onClick={handleLoginClick}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-full 
                    bg-primary/10 
                    flex items-center justify-center
                    group-hover:scale-110 
                    transition-transform duration-300
                    ${isClicking ? 'scale-90' : ''}
                  `}>
                    <FiLock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-base-content">
                      登录后参与讨论
                    </h3>
                    <p className="text-sm text-base-content/60 mt-1">
                      点击登录，加入讨论
                    </p>
                  </div>
                </div>
                
                {/* 悬浮效果装饰 */}
                <div className={`
                  absolute inset-0 
                  border border-primary/20 rounded-lg 
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
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className={`
                btn btn-primary gap-2
                transition-all duration-200
                ${(!content.trim() || isSubmitting)
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-md hover:-translate-y-0.5'
                }
              `}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FiSend className="w-4 h-4" />
              )}
              {isSubmitting ? '发送中...' : '发表评论'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
} 