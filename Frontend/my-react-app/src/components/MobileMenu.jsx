import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import cn from "./lib/utils";

const navigationItems = [
  { name: "Home", href: "/home" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Message", href: "/message" },
];

export default function NavBar() {
  const location = useLocation(); // 获取当前路径
  const currentPage = location.pathname.split("/")[1] || "home";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false); // 切换路径时关闭菜单
  }, [location]);

  const getLinkClass = (href) =>
    cn(
      "block px-4 py-2 text-sm rounded-md transition-colors duration-150",
      location.pathname === href
        ? "font-bold text-primary bg-gray-100"
        : "text-gray-600 hover:bg-gray-100 hover:text-black"
    );

  return (
    <div>
      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <div className="relative">
          {/* Trigger Button */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center bg-gray-200 text-gray-800 shadow-md hover:bg-gray-300 rounded-full px-4 py-2"
            aria-expanded={open}
          >
            <span className="pr-1">
              {currentPage === "home"
                ? "Home"
                : currentPage[0].toUpperCase() + currentPage.slice(1)}
            </span>
            <ChevronDown size={15} />
          </button>

          {/* Dropdown Menu with Animation */}
          <AnimatePresence>
            {open && (
              <motion.div
                className="absolute left-0 w-full mt-2 bg-white shadow-lg rounded-md z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ul className="flex flex-col py-2">
                  {navigationItems.map((item) => (
                    <motion.li
                      key={item.href}
                      whileHover={{ scale: 1.02 }}
                      className="px-4"
                    >
                      <a href={item.href} className={getLinkClass(item.href)}>
                        {item.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex justify-center items-center col-span-2 mt-0.5 h-14">
        <ul className="flex items-center justify-center bg-gray-100 rounded-full px-2 py-1 space-x-4">
          {navigationItems.map((item) => (
            <motion.li
              key={item.name}
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <a
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full font-bold text-sm",
                  location.pathname === item.href
                    ? "text-primary bg-gray-200"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                )}
              >
                {item.name}
              </a>
              {location.pathname === item.href && (
                <motion.div
                  className="absolute inset-0 bg-gray-200 rounded-full"
                  layoutId="underline"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                />
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
