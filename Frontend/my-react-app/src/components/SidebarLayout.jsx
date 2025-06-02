import { HomeIcon, DocumentIcon, PencilSquareIcon, Bars3BottomLeftIcon, UserCircleIcon, UserGroupIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Link, Outlet, useLocation } from "react-router-dom";
import ThemeController from "./ThemeController";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SidebarLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('guest');
  const location = useLocation();

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

  const handleNavigation = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderMenuItem = (item, index) => {
    const isDisabled = item.requiredRole === 'admin' && userRole !== 'admin';
    const isActive = location.pathname === item.path;
    
    return (
      <motion.div
        key={item.path}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="relative"
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
            group relative flex items-center transition-all duration-200 ease-in-out
            ${isSidebarCollapsed 
              ? 'justify-center w-12 h-12 rounded-lg mx-3 my-2' 
              : 'gap-3 px-4 py-3 mx-3 my-1 rounded-xl'
            }
            ${isDisabled 
              ? 'text-gray-400 cursor-not-allowed' 
              : isActive
                ? 'bg-gray-100 text-indigo-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
            }
          `}
          title={isSidebarCollapsed ? item.text : undefined}
        >
          {/* Active state indicator for expanded mode */}
          {isActive && !isDisabled && !isSidebarCollapsed && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full"
              layoutId="activeIndicator"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          
          <div className={`
            w-5 h-5 shrink-0 transition-all duration-200
            ${!isDisabled && 'group-hover:scale-110'}
            ${isActive && !isDisabled ? 'text-indigo-600' : ''}
          `}>
            <item.icon className="w-full h-full" />
          </div>
          
          {!isSidebarCollapsed && (
            <motion.span 
              className={`
                font-medium truncate transition-all duration-200 text-sm
                ${isActive && !isDisabled ? 'text-indigo-600' : ''}
                ${!isDisabled && 'group-hover:text-gray-700'}
              `}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.text}
            </motion.span>
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <motion.div 
        className="lg:hidden flex items-center h-16 px-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200 fixed top-0 left-0 right-0 z-40 shadow-sm"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button 
          className="inline-flex items-center justify-center rounded-lg h-10 w-10 hover:bg-gray-100 transition-all duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bars3BottomLeftIcon className="h-5 w-5 text-gray-600" />
        </motion.button>
        <h1 className="text-lg font-semibold flex-1 text-center text-gray-700">
          管理后台
        </h1>
        <div className="flex items-center gap-3">
          <ThemeController />
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle avatar">
              <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-200">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
            </button>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-white rounded-xl w-44 mt-2 border border-gray-200 text-sm">
              <li><a className="rounded-lg py-2 px-3 text-sm text-gray-700 hover:bg-gray-50">个人设置</a></li>
              <li><a className="text-red-600 rounded-lg py-2 px-3 text-sm hover:bg-red-50">退出登录</a></li>
            </ul>
          </div>
        </div>
      </motion.div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <motion.aside 
          className={`
            ${isSidebarCollapsed ? 'w-20' : 'w-72'} 
            lg:block fixed lg:static inset-y-0 left-0 z-50
            bg-white border-r border-gray-200 shadow-sm
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:h-screen h-[calc(100vh-4rem)] lg:top-0 top-16
            lg:shadow-sm shadow-xl
          `}
          initial={{ x: -288 }}
          animate={{ 
            x: 0,
            width: isSidebarCollapsed ? 80 : 288
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex flex-col h-full">
            {/* Logo area */}
            <motion.div 
              className={`
                border-b border-gray-200 shrink-0 flex items-center
                ${isSidebarCollapsed ? 'justify-center py-6' : 'justify-between px-6 py-6'}
              `}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {isSidebarCollapsed ? (
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <PencilSquareIcon className="h-5 w-5 text-white" />
                </motion.div>
              ) : (
                <motion.div 
                  className="flex items-center gap-3 min-w-0 flex-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <PencilSquareIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg font-semibold text-gray-700 truncate">
                      管理后台
                    </h1>
                    <p className="text-xs text-gray-500 truncate">
                      内容管理系统
                    </p>
                  </div>
                </motion.div>
              )}
              
              {/* Collapse button - desktop only */}
              {!isSidebarCollapsed && (
                <motion.button 
                  className="hidden lg:inline-flex items-center justify-center rounded-lg h-8 w-8 hover:bg-gray-100 transition-all duration-200 shrink-0"
                  onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <ChevronLeftIcon className="h-4 w-4 text-gray-500" />
                </motion.button>
              )}
            </motion.div>

            {/* Navigation menu */}
            <nav className={`
              flex-1 overflow-y-auto
              ${isSidebarCollapsed ? 'flex flex-col items-center py-4' : 'p-4'}
            `}>
              <div className={isSidebarCollapsed ? 'space-y-4 w-full' : 'space-y-1'}>
                {menuItems.map((item, index) => renderMenuItem(item, index))}
              </div>
            </nav>

            {/* Collapse button for collapsed state */}
            {isSidebarCollapsed && (
              <div className="border-t border-gray-200 p-4 flex justify-center">
                <motion.button 
                  className="inline-flex items-center justify-center rounded-lg h-10 w-10 hover:bg-gray-100 transition-all duration-200"
                  onClick={() => setSidebarCollapsed(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="展开侧边栏"
                >
                  <ChevronLeftIcon className="h-4 w-4 text-gray-500 rotate-180" />
                </motion.button>
              </div>
            )}

            {/* User info area */}
            <div className={`
              border-t border-gray-200 bg-gray-50/50
              ${isSidebarCollapsed ? 'p-4 flex flex-col items-center gap-4' : 'p-4'}
            `}>
              {isSidebarCollapsed ? (
                <motion.div 
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Theme toggle */}
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center" title="主题设置">
                    <ThemeController />
                  </div>
                  
                  {/* User avatar */}
                  <div className="relative" title="用户信息">
                    <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-gray-200">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Theme toggle section */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ThemeController />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">主题设置</span>
                  </div>
                  
                  {/* User section */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-gray-200">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">用户名</p>
                      <p className="text-xs text-gray-500 truncate">user@example.com</p>
                    </div>
                    <div className="dropdown dropdown-top dropdown-end">
                      <button tabIndex={0} className="btn btn-ghost btn-sm p-1 h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-white rounded-xl w-44 mb-2 border border-gray-200 text-sm">
                        <li><a className="rounded-lg py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">个人设置</a></li>
                        <li><a className="text-red-600 rounded-lg py-2 px-3 text-sm hover:bg-red-50 transition-colors">退出登录</a></li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.aside>

        {/* Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* Main content area */}
        <main className={`
          flex-1 transition-all duration-300
          lg:pt-0 pt-16 w-full min-h-screen
          bg-gray-50
        `}>
          <motion.div 
            className="h-[calc(100vh-4rem)] lg:h-screen overflow-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="w-full px-6 lg:px-8 xl:px-12 py-8">
              <Outlet />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}