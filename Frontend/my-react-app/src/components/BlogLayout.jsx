import { useState, useEffect } from "react";
import BlogHeader from "./BlogHeader";
import MainWrapper from "./MainWrapper";
import Footer from "./Footer";
import LoginModal from "./LoginModal";

export default function BlogLayout({ children }) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 检查用户认证状态
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
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
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0">
                    <BlogHeader 
                        onLoginClick={() => setIsLoginModalOpen(true)}
                        isAuthenticated={isAuthenticated}
                        onLogout={handleLogout}
                    />
                    <MainWrapper>
                        {children}
                    </MainWrapper>
                </div>
                <Footer className="mt-auto" />
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={handleLogin}
            />
        </>
    );
}