import axiosInstance from '../Axios';
// 获取文章详情
export const getArticle = async (id) => {
  return await axiosInstance.get(`/article/${id}`);
};

// 创建文章
export const createArticle = async (articleData) => {
  return await axiosInstance.post('/article/publish', articleData);
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

// 获取热门文章
export const getHotArticles = async () => {
  return await axiosInstance.get("/article/list/hotArticle");
};

// 删除文章
export const deleteArticles = async (ids) => {
  return await axiosInstance.delete("/article/auth/delete", {
    data: ids  // DELETE 请求的数据需要放在 data 字段中
  });
};

// 记录文章访问
export const recordArticleVisit = async (id) => {
  return await axiosInstance.get(`/article/visit/${id}`);
};

// 保存文章草稿
export const saveDraft = async (articleData) => {
  return await axiosInstance.post('/article/auth/saveDraft', articleData);
};

// 上传图片到MiniO
export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  try {
    const response = await axiosInstance.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // 直接返回原始响应数据
    return response.data;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

// 处理响应
const handleResponse = (response) => {
  // 处理图片上传特殊返回格式 (success 和 url 字段)
  if (response.data.success === 1 && response.data.url) {
    return response.data;
  }
  
  // 处理标准API返回格式
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
  getHotArticles: wrapAPI(getHotArticles),
  deleteArticles: wrapAPI(deleteArticles),
  recordArticleVisit: wrapAPI(recordArticleVisit),
  saveDraft: wrapAPI(saveDraft),
  uploadImage
}; 