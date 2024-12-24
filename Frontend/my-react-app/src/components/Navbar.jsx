import { motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

const Navbar = ({ page, onSectionClick }) => {
  const navigationItems = [
    { name: "Home", href: "#home" },
    { name: "Project", href: "#project" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
  ];

  const NavItem = ({ item }) => {
    const selected = page === item.href;
    
    return (
      <motion.li
        className="relative flex items-center justify-center"
        aria-selected={selected}
        tabIndex={0}
      >
        {selected && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-white rounded-full shadow-lg"
            layoutId="selected"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              mass: 0.5,
            }}
          ></motion.div>
        )}
        <button 
          onClick={() => onSectionClick(item.href.slice(1))}
          className={`relative px-4 py-2 rounded-full font-bold text-sm ${
            selected ? "text-black" : "text-gray-600"
          }`}
        >
          {item.name}
        </button>
      </motion.li>
    );
  };

  return (
    <div className="flex justify-center items-center h-14">
      <ul className="items-center justify-center bg-gray-300/65 rounded-full hidden sm:flex px-2 py-1 space-x-4">
        {navigationItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </ul>

      {/* 移动端菜单 */}
      <div className="flex items-center justify-center sm:hidden">
        <details className="dropdown">
          <summary className="btn btn-md btn-ghost flex items-center justify-between">
            Menu
            <IoIosArrowDown className="h-6 w-6 ml-2" />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <button 
                  onClick={() => onSectionClick(item.href.slice(1))}
                  className="hover:bg-gray-100 rounded-md"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
};

export default Navbar;
