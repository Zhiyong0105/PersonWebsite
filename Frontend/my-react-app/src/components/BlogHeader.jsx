import {Link} from "react-router-dom"
import { HiOutlineEmojiHappy } from "react-icons/hi";
import ThemeController from "./ThemeController";
import { CiSearch } from "react-icons/ci";
import { useState,useEffect} from "react";
import UserButton from "./UserButton"
import Login from "./Login"
import { IoIosArrowDropdownCircle } from "react-icons/io";
import SearchModal from "./SearchModal";
import { MdOutlineLightMode } from "react-icons/md";

export default function BlogHeader(){
    const [isLogin,setIsLogin] = useState(false);
    const [isOpen,setIsOpen] = useState(false);
    const toggleToSwithUserButton =  () =>{
        setIsLogin(true);
    }
    const openModal = () => {
    setIsOpen(true);
  };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLogin(true);
        }
    }, []);
    return (
<div className="flex items-center justify-between py-10 w-full">
    <SearchModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    <div className="flex items-center gap-2 flex-shrink-0">
        <HiOutlineEmojiHappy className="h-6 w-6" />
        <div className="hidden h-6 items-center text-2xl font-semibold leading-6 sm:block">
            <Link to={"/"}>AbstartP.dev</Link>
        </div>
    </div>
    <div className="flex items-center space-x-4 leading-5 sm:space-x-6 flex-grow justify-end">
    {/* 搜索按钮 */}
    <button className="btn btn-ghost " 
    onClick={openModal}>
        <CiSearch className="h-6 w-6" />
    </button>    
    {/* 登录或用户按钮 */}
 
    {isLogin ? <UserButton /> : <Login toggleToSwithUserButton={toggleToSwithUserButton} />}
 

    {/* 主题切换按钮 */}
  <div className="hidden sm:block">
    <ThemeController />
  </div>
    </div>
    
    <div className="sm:hidden flex-shrink-0">
        <div className="dropdown dropdown-hover  dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1 btn-ghost">
                <IoIosArrowDropdownCircle className="h-6 w-6" />
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li><a>Home</a></li>
                <li><a>Category</a></li>
                <li className="flex justify-center items-center w-full">
                    <label className="flex cursor-pointer gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <path
                            d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                        </svg>
                        <input type="checkbox" value="dark" className="toggle theme-controller" />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                        </label>

                </li>
            </ul>
        </div>
    </div>
</div>


    )
}