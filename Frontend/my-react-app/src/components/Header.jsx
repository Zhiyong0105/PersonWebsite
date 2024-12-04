import { useLocation } from "react-router-dom";
import Navbar from './Navbar'
import Avatar from './Avatar'
import GithubIcon from '../icons/GithubIcon'
export default function Header() {
    // 获取当前路径
  const location = useLocation();
  const pathname = location.pathname;

    // 分割路径并提取前两部分
  const page = pathname.split("/").slice(0, 2).join("/");
  
  return (
      <header className="grid w-full grid-cols-1 sm:grid-cols-4 items-center">
        <div className="col-span-1">
          <Avatar page={page} />
        </div>
        <div className="col-span-2">
          <Navbar page={page} />
        </div>
        <div className="col-span-1 flex justify-end">
          <GithubIcon />
        </div>
      </header>
  );

  
}