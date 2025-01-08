import axiosInstance from '../Axios';
import qs from 'qs';

// 用户登录
export const login = async (username, password) => {
  const formData = {
    username,
    password
  };
  
  return await axiosInstance.post('/user/login', qs.stringify(formData), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

// 用户登出
export const logout = async () => {
  try {
    const response = await axiosInstance.post('/user/logout');
    // 如果成功，清除本地存储
    if (response.data.code === 200) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('loginSource');
    }
    return response;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// GitHub OAuth 验证 token
export const verifyGithubToken = async () => {
  return await axiosInstance.get('/user/github/verifyToken', {
    withCredentials: true
  });
};

// 获取用户信息
// TODO: 还没实现
export const getUserInfo = async () => {
  return await axiosInstance.get('/user/info');
};

// 更新用户信息
// TODO: 还没实现
export const updateUserInfo = async (userInfo) => {
  return await axiosInstance.put('/user/info', userInfo);
};

// 用户注册
export const register = async (userData) => {
  return await axiosInstance.post('/user/register', userData);
};

// 修改密码
// TODO: 还没实现
export const changePassword = async (passwordData) => {
  return await axiosInstance.post('/user/password', passwordData);
};

// 刷新 token
// TODO: 还没实现
export const refreshToken = async () => {
  return await axiosInstance.post('/user/refresh-token');
};

// 检查用户名是否可用
// TODO: 还没实现
export const checkUsername = async (username) => {
  return await axiosInstance.get(`/user/check-username?username=${username}`);
};

// 发送验证码
// TODO: 还没实现
export const sendVerificationCode = async (email) => {
  return await axiosInstance.post('/user/send-code', { email });
};

// 验证邮箱验证码
// TODO: 还没实现
export const verifyEmailCode = async (email, code) => {
  return await axiosInstance.post('/user/verify-code', { email, code });
};

// 重置密码
// TODO: 还没实现
export const resetPassword = async (resetData) => {
  return await axiosInstance.post('/user/reset-password', resetData);
};

// 获取用户角色和权限
// TODO: 还没实现
export const getUserRole = async () => {
  return await axiosInstance.get('/user/role');
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
      // 对于登出请求，即使返回 200 也不要返回 data
      if (response.config?.url === '/user/logout') {
        return response.data;
      }
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  };
};

// 导出包装后的 API
export const userAPI = {
  login: wrapAPI(login),
  logout: wrapAPI(logout),
  verifyGithubToken: wrapAPI(verifyGithubToken),
  getUserInfo: wrapAPI(getUserInfo),
  updateUserInfo: wrapAPI(updateUserInfo),
  register: wrapAPI(register),
  changePassword: wrapAPI(changePassword),
  refreshToken: wrapAPI(refreshToken),
  checkUsername: wrapAPI(checkUsername),
  sendVerificationCode: wrapAPI(sendVerificationCode),
  verifyEmailCode: wrapAPI(verifyEmailCode),
  resetPassword: wrapAPI(resetPassword),
  getUserRole: wrapAPI(getUserRole)
};
