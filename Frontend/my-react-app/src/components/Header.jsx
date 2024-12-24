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

const Header = ({ onSectionClick }) => {
    const [page, setPage] = useState("/home");

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-base-100/80 backdrop-blur-sm">
            <div className="container mx-auto">
                <div className="navbar">
                    <div className="navbar-start">
                        <Avatar page={page} />
                    </div>
                    
                    <div className="navbar-center">
                        <Navbar page={page} onSectionClick={onSectionClick} />
                    </div>

                    <div className="navbar-end">
                        <ThemeController />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;