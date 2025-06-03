import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

const Navbar = ({ page, onSectionClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { name: "Home", href: "#home" },
    { name: "Projects", href: "#project" },
    { name: "Blog", href: "#blog" },
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

  const MobileNavItem = ({ item, index }) => {
    const selected = page === item.href;
    
    return (
      <motion.li
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.3 }}
        className="w-full"
      >
        <button 
          onClick={() => {
            onSectionClick(item.href.slice(1));
            setIsMobileMenuOpen(false);
          }}
          className={`w-full text-center px-6 py-3 text-base font-medium transition-all duration-300 rounded-xl ${
            selected 
              ? "text-primary bg-primary/15 shadow-sm" 
              : "text-base-content/80 hover:text-primary hover:bg-white/20"
          }`}
        >
          {item.name}
        </button>
      </motion.li>
    );
  };

  return (
    <>
      {/* 桌面端导航 */}
      <div className="hidden sm:flex justify-center items-center h-14">
        <ul className="items-center justify-center bg-gray-300/65 rounded-full flex px-2 py-1 space-x-4">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </ul>
      </div>

      {/* 移动端菜单按钮 - 与Logo融合的下拉箭头 */}
      <div className="sm:hidden">
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{ 
              rotate: isMobileMenuOpen ? 180 : 0,
              scale: isMobileMenuOpen ? 0.9 : 1
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <IoIosArrowDown className="h-4 w-4 text-base-content/70" />
          </motion.div>
        </motion.button>
      </div>

      {/* 移动端玻璃磨砂菜单 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/10 z-40 sm:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* 玻璃磨砂菜单内容 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-16 left-4 right-4 z-50 sm:hidden"
            >
              <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl overflow-hidden">
                {/* 菜单头部 */}
                <div className="px-6 py-4 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-base-content/60">Navigation</span>
                    <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                  </div>
                </div>
                
                {/* 菜单项 */}
                <div className="p-4">
                  <ul className="space-y-2">
                    {navigationItems.map((item, index) => (
                      <MobileNavItem key={item.href} item={item} index={index} />
                    ))}
                  </ul>
                </div>
                
                {/* 底部装饰 */}
                <div className="h-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30"></div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
