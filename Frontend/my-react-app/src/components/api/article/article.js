import axiosInstance from '../Axios';
// 获取文章详情
export const getArticle = async (id) => {
  return await axiosInstance.get(`/article/${id}`);
};

// 创建文章
export const createArticle = async (articleData) => {
  return await axiosInstance.post('/article/auth/back/create', articleData);
};

// 更新文章
export const updateArticle = async (articleData) => {
  return await axiosInstance.put('/article/auth/back/update', articleData);
};

// 获取评论列表
export const getComments = async (params) => {
  return await axiosInstance.get('/comment/getComment', { params });
};

// 添加评论
export const addComment = async (commentData) => {
  return await axiosInstance.post('/comment/auth/add', commentData);
};

// 获取文章列表
export const getArticleList = async (params) => {
  return await axiosInstance.get("/article/list", { params });
};

// 删除文章
export const deleteArticles = async (ids) => {
  return await axiosInstance.delete("/article/auth/back/delete", {
    data: ids  // DELETE 请求的数据需要放在 data 字段中
  });
};

// 处理响应
const handleResponse = (response) => {
  if (response.data.code === 200) {
    return response.data.data;
  }
  throw new Error(response.data.msg || '请求失败');
};

// 统一的错误处理
const handleError = (error) => {
  console.error('API Error:', error);
  throw error;
};

// 包装 API 调用
const wrapAPI = (apiCall) => {
  return async (...args) => {
    try {
      const response = await apiCall(...args);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  };
};

// 导出包装后的 API
export const articleAPI = {
  getArticle: wrapAPI(getArticle),
  createArticle: wrapAPI(createArticle),
  updateArticle: wrapAPI(updateArticle),
  getComments: wrapAPI(getComments),
  addComment: wrapAPI(addComment),
  getArticleList: wrapAPI(getArticleList),
  deleteArticles: wrapAPI(deleteArticles)
}; 