import axios from "axios";

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 设置后端 API 基础路径
  withCredentials: true,  // 允许跨域请求携带 cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 在请求头中添加 Bearer Token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token过期或无效，重定向到登录页
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;