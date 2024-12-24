import { Link,useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu"
import { IoIosArrowDown } from "react-icons/io";
import LoginModal from './LoginModal';
import { useState } from "react";

const navigationItems = [
  { name: "Home", href: "/home" },
  { name: "Project", href: "/project" },
  { name: "About", href: "/about" },
  { name: "Experience", href: "/experience" },
];

const Navbar = ({ page }) => {
const location = useLocation();
const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

const isSelected = (href) => page === href;

const NavItem = ({ item }) => {
    const selected = isSelected(item.href);
    
    return (
      <motion.li
        className="relative flex items-center justify-center"
        aria-selected={selected}
        tabIndex={0}
      >
        {selected && (
          <>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-white rounded-full shadow-lg"
              layoutId="selected" // This ensures smooth transitions
              initial={{ scale: 0.8, opacity: 0.5 }} // 初始状态：缩小且透明
              animate={{ scale: 1, opacity: 1 }} // 动画结束状态：正常大小和不透明
              transition={{
                type: "spring", // 使用弹性动画
                stiffness: 100, // 刚度，值越大弹性越强
                damping: 10, // 阻尼，值越小振幅越大
                mass: 0.5, // 影响弹性速度
              }}
            ></motion.div>
          </>
        )}
        <Link to={item.href} >
          <motion.div
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            className={`relative px-4 py-2 rounded-full font-bold text-sm ${
              selected ? "text-black" : "text-gray-600"
            }`}
          >
            {item.name}
          </motion.div>
        </Link>
      </motion.li>
    );
  };

  return (
    <>
      <div className="flex justify-center items-center col-span-2 mt-0.5  sm:flex h-14">
        <ul className=" items-center justify-center bg-gray-300/65  rounded-full hidden sm:flex px-2 py-1 space-x-4 test-base-contant">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </ul>
        <div className="flex items-center justify-center sm:hidden">
            {/* <MobileMenu /> */}
        <details className="dropdown">
          <summary className="btn btn-md btn-ghost flex items-center justify-between">
            Menu
            <IoIosArrowDown className="h-6 w-6 ml-2" />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:bg-gray-100 rounded-md">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </details>
        </div>

      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
