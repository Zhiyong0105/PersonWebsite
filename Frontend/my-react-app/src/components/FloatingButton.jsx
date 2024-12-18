import { useState,useEffect } from "react";

import { FaArrowUp } from "react-icons/fa6";
import { BiSolidCommentDetail } from "react-icons/bi";

export default function FloatingButton(){
    const [showScrollTop, setShowScrollTop] = useState(false); // 控制回到顶部按钮显示
    const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200); // 滚动超过200px时显示按钮
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return(
    <div
        className=" fixed bottom-4 right-8  flex-col space-y-4 hidden md:flex"
    >

    <button
    onClick={scrollToTop}
    className="btn-circle btn-sm btn"
    style={{
      opacity: showScrollTop ? 1 : 0,
      transform: showScrollTop ? 'scale(1)' : 'scale(0.8)',
    }}
  >
    <BiSolidCommentDetail className="h-6 w-6"/>
  </button>
  <button
    onClick={scrollToTop}
    className="btn-circle btn-sm btn"
    style={{
      opacity: showScrollTop ? 1 : 0,
      transform: showScrollTop ? 'scale(1)' : 'scale(0.8)',
    }}
  >
    <FaArrowUp className="h-6 w-6"/>
  </button>


        

    </div>

  )
}