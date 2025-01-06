import { Navigate } from 'react-router-dom';

export default function PrivateElement({ element, requiredRole }) {
  // 从 localStorage 中获取 token 和用户信息
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userRole = userInfo.role || 'guest';
  const currentPath = window.location.pathname;

  // 如果没有 token，重定向到首页
  if (!token) {
    return <Navigate to="/article" replace />;
  }

  // 用户中心页面的特殊处理：所有登录用户都可访问
  if (currentPath === '/admin/user-center') {
    return element;
  }

  // 权限判断逻辑
  const hasPermission = () => {
    switch (requiredRole) {
      case 'admin':
        return userRole === 'admin';
      case 'user':
        return userRole === 'user' || userRole === 'admin';
      default:
        return true; // 没有指定 requiredRole 时默认允许访问
    }
  };

  // 根据权限判断结果返回
  return hasPermission() 
    ? element 
    : <Navigate to="/admin/user-center" replace />;
}
