import { Link } from "react-router-dom";
import { userAPI } from './api/user/user';

export default function UserButton() {
  const handleLogout = async () => {
    try {
      await userAPI.logout();
      
      // 清除所有存储
      localStorage.clear();  // 或者具体指定要清除的项
      // localStorage.removeItem("token");
      // localStorage.removeItem("userInfo");
      sessionStorage.removeItem("loginSource");
      
      // 触发登录状态改变事件
      window.dispatchEvent(new Event('loginStateChanged'));
      
      // 重定向到文章列表
      window.location.href = '/article';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo?.username}`} 
            alt="avatar" 
          />
        </div>
      </div>
      <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        {userInfo?.role === 'admin' ? (
          <>
            <li><Link to="/admin">管理后台</Link></li>
            <li><Link to="/admin/user-center">用户中心</Link></li>
          </>
        ) : (
          <li><Link to="/admin/user-center">用户中心</Link></li>
        )}
        <li>
          <button 
            onClick={handleLogout}
            className="text-error hover:bg-error/10"
          >
            退出登录
          </button>
        </li>
      </ul>
    </div>
  );
}