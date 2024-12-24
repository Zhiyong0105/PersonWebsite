import { Link } from "react-router-dom";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import ThemeController from "./ThemeController";
import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import UserButton from "./UserButton";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FiLogIn } from "react-icons/fi";
import SearchModal from "./SearchModal";

export default function BlogHeader({ onLoginClick }) {
    const [isLogin, setIsLogin] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLogin(true);
        }
    }, []);

    return (
        <div className="flex items-center justify-between py-10 w-full">
            <SearchModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
            
            {/* Logo部分 */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <HiOutlineEmojiHappy className="h-6 w-6" />
                <div className="hidden h-6 items-center text-2xl font-semibold leading-6 sm:block">
                    <Link to={"/article"}>AbstractP.dev</Link>
                </div>
            </div>

            {/* 中间部分 */}
            <div className="flex items-center space-x-4 leading-5 sm:space-x-6 flex-grow justify-end">
                {/* 搜索按钮 */}
                <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => setIsOpen(true)}
                >
                    <CiSearch className="h-5 w-5" />
                </button>

                {/* 登录/用户按钮 */}
                {isLogin ? (
                    <UserButton />
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="btn btn-sm bg-base-200 hover:bg-base-300 border-none 
                                 text-base-content gap-2 normal-case font-medium"
                    >
                        <FiLogIn className="w-4 h-4" />
                        登录
                    </button>
                )}

                {/* 主题切换按钮 */}
                <div className="hidden sm:block">
                    <ThemeController />
                </div>
            </div>

            {/* 移动端菜单 */}
            <div className="sm:hidden flex-shrink-0">
                <div className="dropdown dropdown-hover dropdown-end">
                    <div tabIndex={0} role="button" className="btn m-1 btn-ghost">
                        <IoIosArrowDropdownCircle className="h-6 w-6" />
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><Link to="/">首页</Link></li>
                        <li><Link to="/category">分类</Link></li>
                        <li className="flex justify-center items-center w-full">
                            <ThemeController />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}