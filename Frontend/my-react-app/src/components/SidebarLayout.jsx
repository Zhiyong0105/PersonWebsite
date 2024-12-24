import { HomeIcon, DocumentIcon, PencilSquareIcon, Bars3BottomLeftIcon, UserCircleIcon, UserGroupIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate, Link, Routes, Route, Outlet } from "react-router-dom";
import Editor from "./Editor";
import ThemeController from "./ThemeController";
import { useState, useEffect } from "react";
import ArticleEditor from './ArticleEditor';
import ArticleManager from './ArticleManager';
import Dashboard from './Dashboard';
import UserManager from './UserManager';

const UserCenter = () => {
  return (
    <div className="h-full">
      <div className="bg-base-100 rounded-xl shadow-sm h-full flex flex-col">
        <div className="px-4 lg:px-6 py-4 border-b border-base-200/80">
          <h1 className="text-xl font-bold text-base-content">用户中心</h1>
          <p className="text-sm text-base-content/60 mt-1">管理您的个人信息</p>
        </div>
        <div className="p-4 lg:p-6 flex-1">
          <div className="space-y-6">
            <div className="bg-base-200/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">个人资料</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SidebarLayout() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('guest');

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    setUserRole(userInfo.role || 'guest');
  }, []);

  const menuItems = [
    { 
      icon: HomeIcon, 
      text: "Dashboard",
      path: "/admin",
      requiredRole: 'admin'
    },
    { 
      icon: UserCircleIcon,
      text: "用户中心",
      path: "/admin/user-center",
      requiredRole: 'guest'
    },
    { 
      icon: DocumentIcon, 
      text: "文章管理", 
      path: "/admin/articles",
      requiredRole: 'admin'
    },
    { 
      icon: PencilSquareIcon, 
      text: "写文章", 
      path: "/admin/editor",
      requiredRole: 'admin'
    },
    { 
      icon: UserGroupIcon, 
      text: "用户管理", 
      path: "/admin/users",
      requiredRole: 'admin'
    },
  ];

  const UserSection = () => (
    <div className="flex items-center gap-3 p-4">
      <div className="avatar">
        <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">用户名</p>
        <p className="text-xs text-base-content/60 truncate">user@example.com</p>
      </div>
      <div className="dropdown dropdown-top dropdown-end">
        <button tabIndex={0} className="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mb-2">
          <li><a>个人设置</a></li>
          <li><a className="text-error">退出登录</a></li>
        </ul>
      </div>
    </div>
  );

  const handleNavigation = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderMenuItem = (item) => {
    const isDisabled = item.requiredRole === 'admin' && userRole !== 'admin';
    
    return (
      <Link
        key={item.path}
        to={isDisabled ? '#' : item.path}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            alert('您没有权限访问此功能');
            return;
          }
          handleNavigation();
        }}
        className={`
          flex items-center gap-3 px-4 py-3
          ${isDisabled 
            ? 'text-base-content/30 cursor-not-allowed' 
            : 'text-base-content/70 hover:bg-base-200/70 hover:shadow-sm'
          }
          rounded-lg transition-all duration-200 
          group w-full
        `}
      >
        <item.icon className={`h-5 w-5 shrink-0 ${!isDisabled && 'group-hover:text-primary'}`} />
        {!isSidebarCollapsed && (
          <span className={`font-medium truncate ${!isDisabled && 'group-hover:text-primary'}`}>
            {item.text}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* 移动端顶栏 */}
      <div className="lg:hidden flex items-center h-16 px-4 border-b bg-base-100 fixed top-0 left-0 right-0 z-40">
        <button 
          className="btn btn-ghost btn-sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Bars3BottomLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">管理后台</h1>
        <div className="flex items-center gap-2">
          <ThemeController />
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle avatar">
              <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
            </button>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-4">
              <li><a>个人设置</a></li>
              <li><a className="text-error">退出登录</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* 侧边栏 */}
        <aside className={`
          ${isSidebarCollapsed ? 'w-20' : 'w-72'} 
          lg:block fixed lg:static inset-y-0 left-0 z-50
          transform transition-all duration-300 ease-in-out
          bg-base-100 lg:transform-none border-r border-base-200/80
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:h-screen h-[calc(100vh-4rem)] lg:top-0 top-16
        `}>
          <div className="flex flex-col h-full">
            {/* Logo 区域 */}
            <div className="p-6 border-b border-base-200/80 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <PencilSquareIcon className="h-5 w-5 text-primary" />
                </div>
                {!isSidebarCollapsed && <h1 className="text-lg font-bold">管理后台</h1>}
              </div>
              {/* 折叠按钮 - 仅在桌面端显示 */}
              <button 
                className="hidden lg:block btn btn-ghost btn-sm btn-square"
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              >
                <ChevronLeftIcon className={`h-5 w-5 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* 导航菜单 */}
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-1.5">
                {menuItems.map(renderMenuItem)}
              </div>
            </nav>

            {/* 用户信息区域 */}
            <div className="border-t border-base-200/80">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <ThemeController />
                  {!isSidebarCollapsed && (
                    <span className="text-sm text-base-content/60">主题切换</span>
                  )}
                </div>
                {!isSidebarCollapsed ? (
                  <UserSection />
                ) : (
                  <div className="flex justify-center">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* 遮罩层 */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* 主内容区 */}
        <main className={`
          flex-1 transition-all duration-300
          ${isSidebarCollapsed ? 'lg:pl-5' : 'lg:pl-3'}
          lg:pt-0 pt-16 w-full
        `}>
          <div className="h-[calc(100vh-4rem)] lg:h-screen overflow-auto p-4 lg:p-6">
            <div className="h-full max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}