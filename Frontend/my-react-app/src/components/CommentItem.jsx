import { useState } from 'react';

export default function CommentItem({ comment }) {
  const [showReplies, setShowReplies] = useState(false);

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
            <span className="text-sm text-base-content/60">
              {new Date(comment.createTime).toLocaleString()}
            </span>
          </div>
          <p className="mt-2">{comment.commentContent}</p>
          
          {/* 回复按钮和回复数量 */}
          <div className="flex items-center gap-4 mt-2">
            <button className="text-sm text-base-content/60 hover:text-primary">
              回复
            </button>
            {comment.childCommentCount > 0 && (
              <button 
                className="text-sm text-primary hover:text-primary/80"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? '收起回复' : `查看 ${comment.childCommentCount} 条回复`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 子评论区域 */}
      {showReplies && comment.childComments && (
        <div className="ml-12 mt-4 space-y-4">
          {comment.childComments.map(reply => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
} 