import { Link } from "react-router-dom";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import ThemeController from "./ThemeController";
import { useState, useEffect } from "react";
import UserButton from "./UserButton";
import { FiLogIn } from "react-icons/fi";

export default function BlogHeader({ onLoginClick }) {
    const [isLogin, setIsLogin] = useState(false);

    // 检查登录状态
    const checkLoginStatus = () => {
        const token = localStorage.getItem("token");
        setIsLogin(!!token);
    };

    useEffect(() => {
        checkLoginStatus();
        
        // 监听登录状态变化
        window.addEventListener('loginStateChanged', checkLoginStatus);
        
        return () => {
            window.removeEventListener('loginStateChanged', checkLoginStatus);
        };
    }, []);

    return (
        <div className="flex items-center justify-between py-4 w-full">
            {/* Logo区域 */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-900 rounded-lg">
                        <HiOutlineEmojiHappy className="h-5 w-5 text-white" />
                    </div>
                    <Link to={"/article"} className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                        AbstractP.dev
                    </Link>
                </div>
            </div>

            {/* 右侧功能区 */}
            <div className="flex items-center gap-3">
                {/* 登录/用户按钮 */}
                {isLogin ? (
                    <UserButton />
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <FiLogIn className="w-4 h-4" />
                        <span>登录</span>
                    </button>
                )}

                {/* 主题切换按钮 */}
                <ThemeController />
            </div>
        </div>
    );
}