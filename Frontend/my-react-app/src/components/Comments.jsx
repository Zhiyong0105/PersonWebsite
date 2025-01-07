import { useState, useEffect } from 'react';
import axiosInstance from './Axios';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import CommentItem from './CommentItem';

export default function Comments({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 添加 useEffect 来加载评论
  useEffect(() => {
    fetchComments(pageNum);
  }, [articleId, pageNum]); // 依赖项添加 articleId 和 pageNum

  // 获取评论列表
  const fetchComments = async (page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/comment/getComment', {
        params: { 
          type: 0,  // 默认类型为0
          typeId: articleId,
          pageNum: page, 
          pageSize 
        }
      });
      
      if (response.data.code === 200) {
        const {page,total} = response.data.data
        setComments(page);
        setTotal(total); // 或者从后端获取总数
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-8">
      {/* 评论统计 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">评论 ({total})</h2>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {/* 分页 */}
      {total > pageSize && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <PaginationButton
              onClick={() => setPageNum(prev => Math.max(1, prev - 1))}
              disabled={pageNum === 1 || loading}
            >
              <IoChevronBack className="w-4 h-4" />
              <span>上一页</span>
            </PaginationButton>

            <PaginationButton
              onClick={() => setPageNum(prev => Math.min(Math.ceil(total / pageSize), prev + 1))}
              disabled={pageNum === Math.ceil(total / pageSize) || loading}
            >
              <span>下一页</span>
              <IoChevronForward className="w-4 h-4" />
            </PaginationButton>
          </div>
        </div>
      )}
    </div>
  );
} 