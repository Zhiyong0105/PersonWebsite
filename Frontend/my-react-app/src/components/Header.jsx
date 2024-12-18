import Avatar from "./Avatar";
import Navbar from "./Navbar";
import GithubIcon from "../icons/GithubIcon"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom";
import User from "./User";
import ThemeController from "./ThemeController";
import Login from "./Login"
import {useState,useEffect} from "react"
import UserButton from "./UserButton"
export default function Header() {
    const location = useLocation();
    const [isLogin,setIsLogin] = useState(false);
    const pathname = location.pathname; // 获取路径名
    const page = pathname.split("/").slice(0, 2).join("/") || "/";
    const toggleToSwithUserButton =  () =>{
        setIsLogin("true");
    }
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLogin(true);
        }
    }, []);

    return (
        <header className="grid w-full grid-flow-col grid-cols-3 sm:grid-cols-4">
            <Avatar page= {page}/>
            <Navbar page={page}/>

            <div className="flex items-center justify-end gap-2">
                {/* <Link to={"https://github.com/Zhiyong0105"}
                    className="opacity-80 hover:opacity-100"
                >
                    <GithubIcon />
                </Link> */}
                {isLogin ? (
                     <UserButton />
                ): (
                    <Login toggleToSwithUserButton={toggleToSwithUserButton}/>
                )}
               
                
                <ThemeController />
            </div>
            
           

        </header>
    )

}