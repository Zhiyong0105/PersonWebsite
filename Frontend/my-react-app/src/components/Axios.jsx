import axios from "axios";

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 设置后端 API 基础路径
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器：自动添加 JWT Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 从 localStorage 获取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 在请求头中添加 JWT Token
    }
    return config;
  },
  (error) => {
    // 请求发送失败时的逻辑
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理错误
axiosInstance.interceptors.response.use(
  (response) => response, // 如果响应正常，直接返回
  (error) => {
    if (error.response) {
      // 处理后端返回的错误（如 401 未授权）
      if (error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        // 可跳转到登录页面或刷新 Token
      }
    }
    return Promise.reject(error); // 抛出错误供业务逻辑处理
  }
);

export default axiosInstance;
