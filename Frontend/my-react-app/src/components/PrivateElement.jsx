import { Navigate } from 'react-router-dom';

export default function PrivateElement({ element, requiredRole }) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userRole = userInfo.role || 'guest';

  const hasPermission = () => {
    if (requiredRole === 'admin') {
      return userRole === 'admin';
    }
    // 游客只能访问用户中心
    if (userRole === 'guest') {
      return false;
    }
    return true;
  };

  // 游客用户直接重定向到用户中心
  if (userRole === 'guest') {
    return <Navigate to="/admin/user-center" replace />;
  }

  return hasPermission() ? element : <Navigate to="/admin/user-center" replace />;
} 