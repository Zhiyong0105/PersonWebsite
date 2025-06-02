import { HomeIcon, DocumentIcon, PencilSquareIcon, Bars3BottomLeftIcon, UserCircleIcon, UserGroupIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Link, Outlet } from "react-router-dom";
import ThemeController from "./ThemeController";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SidebarLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <motion.div 
      className="flex items-center gap-3 p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/20">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-base-content truncate">用户名</p>
        <p className="text-xs text-base-content/50 truncate">user@example.com</p>
      </div>
      <div className="dropdown dropdown-top dropdown-end">
        <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle hover:bg-base-200/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-xl w-48 mb-2 border border-base-200/50">
          <li><a className="rounded-lg">个人设置</a></li>
          <li><a className="text-error rounded-lg">退出登录</a></li>
        </ul>
      </div>
    </motion.div>
  );

  const handleNavigation = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderMenuItem = (item, index) => {
    const isDisabled = item.requiredRole === 'admin' && userRole !== 'admin';
    
    return (
      <motion.div
        key={item.path}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link
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
            flex items-center gap-3 px-4 py-3 mx-2 my-1
            ${isDisabled 
              ? 'text-base-content/30 cursor-not-allowed' 
              : 'text-base-content/70 hover:text-primary hover:bg-primary/5'
            }
            rounded-xl transition-all duration-200 
            group relative overflow-hidden
          `}
        >
          {!isDisabled && (
            <motion.div
              className="absolute inset-0 bg-primary/5 rounded-xl"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          <item.icon className={`h-5 w-5 shrink-0 relative z-10 ${!isDisabled && 'group-hover:text-primary'}`} />
          {!isSidebarCollapsed && (
            <span className={`font-medium truncate relative z-10 ${!isDisabled && 'group-hover:text-primary'}`}>
              {item.text}
            </span>
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200/30 to-base-300/20">
      {/* 移动端顶栏 */}
      <motion.div 
        className="lg:hidden flex items-center h-16 px-4 bg-white/80 backdrop-blur-xl border-b border-base-200/50 fixed top-0 left-0 right-0 z-40"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button 
          className="btn btn-ghost btn-sm hover:bg-base-200/50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Bars3BottomLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          管理后台
        </h1>
        <div className="flex items-center gap-2">
          <ThemeController />
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle avatar">
              <div className="w-8 h-8 rounded-xl overflow-hidden ring-2 ring-primary/20">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
            </button>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-xl w-48 mt-4 border border-base-200/50">
              <li><a className="rounded-lg">个人设置</a></li>
              <li><a className="text-error rounded-lg">退出登录</a></li>
            </ul>
          </div>
        </div>
      </motion.div>

      <div className="flex min-h-screen">
        {/* 侧边栏 */}
        <motion.aside 
          className={`
            ${isSidebarCollapsed ? 'w-20' : 'w-80'} 
            lg:block fixed lg:static inset-y-0 left-0 z-50
            transform transition-all duration-300 ease-in-out
            bg-white/90 backdrop-blur-xl lg:transform-none border-r border-base-200/30
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:h-screen h-[calc(100vh-4rem)] lg:top-0 top-16 shadow-xl lg:shadow-none
          `}
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col h-full">
            {/* Logo 区域 */}
            <motion.div 
              className="p-6 border-b border-base-200/30 shrink-0 flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center ring-2 ring-primary/10">
                  <PencilSquareIcon className="h-6 w-6 text-primary" />
                </div>
                {!isSidebarCollapsed && (
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    管理后台
                  </h1>
                )}
              </div>
              {/* 折叠按钮 - 仅在桌面端显示 */}
              <button 
                className="hidden lg:block btn btn-ghost btn-sm btn-circle hover:bg-base-200/50"
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              >
                <ChevronLeftIcon className={`h-4 w-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>

            {/* 导航菜单 */}
            <nav className="flex-1 px-2 py-6 overflow-y-auto">
              <div className="space-y-1">
                {menuItems.map((item, index) => renderMenuItem(item, index))}
              </div>
            </nav>

            {/* 用户信息区域 */}
            <div className="border-t border-base-200/30 bg-base-50/30">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ThemeController />
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-sm text-base-content/60 font-medium">主题切换</span>
                  )}
                </div>
                {!isSidebarCollapsed ? (
                  <UserSection />
                ) : (
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/20">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* 遮罩层 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* 主内容区 */}
        <main className={`
          flex-1 transition-all duration-300
          ${isSidebarCollapsed ? 'lg:pl-5' : 'lg:pl-3'}
          lg:pt-0 pt-16 w-full
        `}>
          <motion.div 
            className="h-[calc(100vh-4rem)] lg:h-screen overflow-auto p-4 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-full max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}