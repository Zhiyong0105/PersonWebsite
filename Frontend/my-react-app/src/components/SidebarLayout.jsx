import { 
  HomeIcon, 
  DocumentIcon, 
  PencilSquareIcon, 
  Bars3BottomLeftIcon, 
  UserCircleIcon, 
  UserGroupIcon, 
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
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
              ? 'justify-center w-10 h-10 rounded-lg mx-2 my-1' 
              : 'gap-3 px-3 py-2.5 mx-2 my-0.5 rounded-lg'
            }
            ${isDisabled 
              ? 'text-gray-400 cursor-not-allowed' 
              : isActive
                ? 'bg-gray-100 text-indigo-600 font-medium'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
          title={isSidebarCollapsed ? item.text : undefined}
        >
          {/* Active state indicator for expanded mode */}
          {isActive && !isDisabled && !isSidebarCollapsed && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full"
              layoutId="activeIndicator"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          
          <div className={`
            w-5 h-5 shrink-0 transition-all duration-200
            ${!isDisabled && 'group-hover:scale-105'}
            ${isActive && !isDisabled ? 'text-indigo-600' : ''}
          `}>
            <item.icon className="w-full h-full" />
          </div>
          
          {!isSidebarCollapsed && (
            <motion.span 
              className={`
                font-medium truncate transition-all duration-200 text-sm
                ${isActive && !isDisabled ? 'text-indigo-600' : ''}
                ${!isDisabled && 'group-hover:text-gray-900'}
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
        className="lg:hidden flex items-center h-16 px-4 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40 shadow-sm"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button 
          className="inline-flex items-center justify-center rounded-lg h-8 w-8 hover:bg-gray-100 transition-all duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bars3BottomLeftIcon className="h-5 w-5 text-gray-700" />
        </motion.button>
        <h1 className="text-lg font-semibold flex-1 text-center text-gray-900">
          管理后台
        </h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <BellIcon className="h-5 w-5 text-gray-700" />
          </button>
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

      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.aside 
          className={`
            bg-white border-r border-gray-200 shadow-sm z-40
            lg:relative lg:block fixed lg:static
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          initial={{ x: -256 }}
          animate={{ 
            x: 0,
            width: isSidebarCollapsed ? 64 : 256
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex flex-col h-full">
            {/* Logo area */}
            <motion.div 
              className="flex items-center justify-between px-4 py-4 border-b border-gray-200 lg:mt-0 mt-16"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {isSidebarCollapsed ? (
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <PencilSquareIcon className="h-5 w-5 text-white" />
                </motion.div>
              ) : (
                <>
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <PencilSquareIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900">
                        管理后台
                      </h1>
                      <p className="text-xs text-gray-500">
                        内容管理系统
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Collapse button */}
                  <motion.button 
                    className="inline-flex items-center justify-center rounded-lg h-8 w-8 hover:bg-gray-100 transition-all duration-200"
                    onClick={() => setSidebarCollapsed(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <ChevronLeftIcon className="h-4 w-4 text-gray-500" />
                  </motion.button>
                </>
              )}
            </motion.div>

            {/* Navigation menu */}
            <nav className="flex-1 overflow-y-auto py-4">
              {/* Navigation Group */}
              {!isSidebarCollapsed && (
                <div className="px-4 mb-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                    导航
                  </p>
                </div>
              )}
              
              <div className="space-y-0.5">
                {menuItems.map((item, index) => renderMenuItem(item, index))}
              </div>
            </nav>

            {/* Expand button for collapsed state */}
            {isSidebarCollapsed && (
              <div className="border-t border-gray-200 p-3 flex justify-center">
                <motion.button 
                  className="inline-flex items-center justify-center rounded-lg h-8 w-8 hover:bg-gray-100 transition-all duration-200"
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
            <div className="border-t border-gray-200 p-4">
              {isSidebarCollapsed ? (
                <motion.div 
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Settings */}
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title="设置">
                    <Cog6ToothIcon className="h-4 w-4 text-gray-500" />
                  </button>
                  
                  {/* User avatar */}
                  <div className="relative" title="用户信息">
                    <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-200">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  {/* Settings section */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <Cog6ToothIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">设置</span>
                  </div>
                  
                  {/* User section */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-200">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">用户名</p>
                      <p className="text-xs text-gray-500 truncate">user@example.com</p>
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* Main content area */}
        <main className="flex-1 bg-gray-50 h-screen flex flex-col">
          {/* Top bar */}
          <motion.div 
            className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Search bar */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-200">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">用户名</span>
                </button>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-white rounded-xl w-48 mt-2 border border-gray-200">
                  <li><a className="rounded-lg py-2 px-3 text-sm text-gray-700 hover:bg-gray-50">个人资料</a></li>
                  <li><a className="rounded-lg py-2 px-3 text-sm text-gray-700 hover:bg-gray-50">设置</a></li>
                  <li className="border-t border-gray-100 mt-1 pt-1">
                    <a className="rounded-lg py-2 px-3 text-sm text-red-600 hover:bg-red-50">退出登录</a>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Main content - Scrollable area */}
          <motion.div 
            className="flex-1 overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="w-full px-6 lg:px-8 xl:px-12 py-4 pb-8">
              <Outlet />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}