import { HomeIcon, DocumentIcon, PencilSquareIcon, Bars3BottomLeftIcon, UserCircleIcon, UserGroupIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate, Link, Routes, Route } from "react-router-dom";
import Editor from "./Editor";
import ThemeController from "./ThemeController";
import { useState } from "react";
import ArticleEditor from './ArticleEditor';
import ArticleManager from './ArticleManager';
import Dashboard from './Dashboard';
import UserManager from './UserManager';

export default function SidebarLayout() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { icon: HomeIcon, text: "首页", path: "/admin" },
    { icon: DocumentIcon, text: "文章管理", path: "/admin/articles" },
    { icon: PencilSquareIcon, text: "写文章", path: "/admin/editor" },
    { icon: UserGroupIcon, text: "用户管理", path: "/admin/users" },
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

  return (
    <div className="h-full bg-base-200">
      {/* 移动端顶栏 - 调整高度和固定定位 */}
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

      <div className="flex h-full">
        {/* 侧边栏 - 调整移动端位置 */}
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
            <nav className="flex h-full px-4 py-6">
              <div className="space-y-1.5">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 text-base-content/70 hover:bg-base-200/70 
                             rounded-lg transition-all duration-200 group"
                  >
                    <item.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                    {!isSidebarCollapsed && (
                      <span className="font-medium group-hover:text-primary transition-colors">{item.text}</span>
                    )}
                  </Link>
                ))}
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

        {/* 遮罩层 - 调整z-index */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* 主内容区 - 添加移动端顶部间距 */}
        <main className={`
          flex-1 min-h-screen transition-all duration-300
          ${isSidebarCollapsed ? 'lg:pl-10' : 'lg:pl-15'}
          lg:pt-0 pt-16 w-full
        `}>
          <div className="h-full  lg:p-6 w-full">
            <Routes>
              <Route path="/editor" element={<ArticleEditor />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/articles" element={<ArticleManager />} />
              <Route path="/users" element={<UserManager />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}