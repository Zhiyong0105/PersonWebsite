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

  const UserSection = () => (
    <motion.div 
      className="flex items-center gap-3 p-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-primary/10">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background"></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">用户名</p>
        <p className="text-xs text-muted-foreground truncate">user@example.com</p>
      </div>
      <div className="dropdown dropdown-top dropdown-end">
        <button tabIndex={0} className="btn btn-ghost btn-xs p-1 h-6 w-6 rounded-md hover:bg-accent transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-popover rounded-lg w-40 mb-2 border border-border text-xs">
          <li><a className="rounded-md py-2 px-3 text-xs hover:bg-accent transition-colors">个人设置</a></li>
          <li><a className="text-destructive rounded-md py-2 px-3 text-xs hover:bg-destructive/10 transition-colors">退出登录</a></li>
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
    const isActive = location.pathname === item.path;
    
    return (
      <motion.div
        key={item.path}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
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
            group relative flex items-center gap-3 px-3 py-2 mx-2 my-0.5 text-sm rounded-lg
            transition-all duration-200 ease-in-out
            ${isDisabled 
              ? 'text-muted-foreground/40 cursor-not-allowed' 
              : isActive
                ? 'bg-primary/10 text-primary font-medium shadow-sm border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }
          `}
        >
          {/* Active state indicator */}
          {isActive && !isDisabled && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full"
              layoutId="activeIndicator"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          
          <div className={`
            w-4 h-4 shrink-0 transition-all duration-200
            ${!isDisabled && 'group-hover:scale-110'}
            ${isActive && !isDisabled ? 'text-primary' : ''}
          `}>
            <item.icon className="w-full h-full" />
          </div>
          
          {!isSidebarCollapsed && (
            <span className={`
              font-medium truncate transition-all duration-200 text-sm
              ${isActive && !isDisabled ? 'text-primary' : ''}
              ${!isDisabled && 'group-hover:text-foreground'}
            `}>
              {item.text}
            </span>
          )}
          
          {/* Hover effect background */}
          {!isDisabled && !isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={false}
            />
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <motion.div 
        className="lg:hidden flex items-center h-14 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border fixed top-0 left-0 right-0 z-40 shadow-sm"
        initial={{ y: -56 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button 
          className="inline-flex items-center justify-center rounded-lg h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bars3BottomLeftIcon className="h-4 w-4" />
        </motion.button>
        <h1 className="text-lg font-bold flex-1 text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          管理后台
        </h1>
        <div className="flex items-center gap-2">
          <ThemeController />
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle avatar">
              <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-border">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
            </button>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-popover rounded-lg w-40 mt-2 border border-border text-xs">
              <li><a className="rounded-md py-2 px-3 text-xs">个人设置</a></li>
              <li><a className="text-destructive rounded-md py-2 px-3 text-xs">退出登录</a></li>
            </ul>
          </div>
        </div>
      </motion.div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <motion.aside 
          className={`
            ${isSidebarCollapsed ? 'w-16' : 'w-64'} 
            lg:block fixed lg:static inset-y-0 left-0 z-50
            transform transition-all duration-300 ease-in-out
            bg-background lg:transform-none border-r border-border/50
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:h-screen h-[calc(100vh-3.5rem)] lg:top-0 top-14
            shadow-xl lg:shadow-none
          `}
          initial={{ x: -256 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col h-full">
            {/* Logo area */}
            <motion.div 
              className="p-4 border-b border-border/50 shrink-0 flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md shrink-0">
                  <PencilSquareIcon className="h-4 w-4 text-primary-foreground" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0 flex-1">
                    <h1 className="text-base font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate">
                      管理后台
                    </h1>
                    <p className="text-xs text-muted-foreground truncate">
                      内容管理系统
                    </p>
                  </div>
                )}
              </div>
              {/* Collapse button - desktop only */}
              <motion.button 
                className="hidden lg:inline-flex items-center justify-center rounded-lg h-7 w-7 hover:bg-accent hover:text-accent-foreground transition-all duration-200 shrink-0"
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeftIcon className={`h-3 w-3 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
              </motion.button>
            </motion.div>

            {/* Navigation menu */}
            <nav className="flex-1 p-3 overflow-y-auto">
              <div className="space-y-1">
                {menuItems.map((item, index) => renderMenuItem(item, index))}
              </div>
            </nav>

            {/* User info area */}
            <div className="border-t border-border/50 bg-muted/10">
              <div className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ThemeController />
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-xs text-muted-foreground font-medium">主题设置</span>
                  )}
                </div>
                {!isSidebarCollapsed ? (
                  <UserSection />
                ) : (
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-border">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
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
          lg:pt-0 pt-14 w-full min-h-screen
          bg-gradient-to-br from-background to-muted/5
        `}>
          <motion.div 
            className="h-[calc(100vh-3.5rem)] lg:h-screen overflow-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="w-full p-4 sm:p-6 lg:p-8 xl:p-12">
              <Outlet />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}