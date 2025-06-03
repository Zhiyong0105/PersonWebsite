import { useState, useEffect } from "react";
import BlogHeader from "./BlogHeader";
import MainWrapper from "./MainWrapper";
import Footer from "./Footer";
import LoginModal from "./LoginModal";
import { userAPI } from './api/user/user';

export default function BlogLayout({ children }) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    // 检查用户认证状态
    const checkAuthStatus = () => {
        const token = localStorage.getItem("token");
        const storedUserInfo = localStorage.getItem("userInfo");
        
        if (token && storedUserInfo) {
            setIsAuthenticated(true);
            setUserInfo(JSON.parse(storedUserInfo));
        } else {
            setIsAuthenticated(false);
            setUserInfo(null);
        }
    };

    useEffect(() => {
        checkAuthStatus();
        
        // 监听登录状态变化
        window.addEventListener('loginStateChanged', checkAuthStatus);
        
        return () => {
            window.removeEventListener('loginStateChanged', checkAuthStatus);
        };
    }, []);

    // 登录处理函数
    const handleLogin = async (credentials) => {
        try {
            // TODO: 实现登录逻辑
            setIsLoginModalOpen(false);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    // 登出处理函数
    const handleLogout = async () => {
        try {
            await userAPI.logout();
            
            // 清除存储
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            sessionStorage.removeItem("loginSource");
            
            // 更新状态
            setIsAuthenticated(false);
            setUserInfo(null);
            
            // 重定向到文章列表
            window.location.href = '/article';
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200">
                    <div className="w-full px-6 lg:px-8">
                        <BlogHeader 
                            onLoginClick={() => setIsLoginModalOpen(true)}
                            isAuthenticated={isAuthenticated}
                            onLogout={handleLogout}
                        />
                    </div>
                </header>
                
                {/* 主要内容区域 */}
                <div className="flex-1">
                    <MainWrapper>
                        {children}
                    </MainWrapper>
                </div>
                
                {/* Footer */}
                <Footer />
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={handleLogin}
            />
        </>
    );
}