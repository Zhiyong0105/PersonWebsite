import { motion } from "framer-motion";
import TypeIntro from "./TypeIntro";
import { FaGithub } from "react-icons/fa";
import { FaBilibili } from "react-icons/fa6";
import { BiLogoBlogger } from "react-icons/bi";
export default function HeroAnimation() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: "easeInOut", duration: 1 },
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-transparent" />

      {/* 主要内容 */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 问候语 */}
        <motion.p
          className="text-2xl md:text-4xl tracking-wide text-base-content/90 mb-4"
          variants={itemVariants}
        >
          Hi, I'm
        </motion.p>

        {/* 名字 */}
        <motion.strong
          className="text-4xl md:text-6xl font-extrabold tracking-wide block mb-6
                   text-base-content"
          variants={itemVariants}
        >
          Abstract P
        </motion.strong>

        {/* 打字效果 */}
        <motion.div 
          variants={itemVariants}
          className="mb-6"
        >
          <TypeIntro />
        </motion.div>

        {/* 个人介绍 */}
        <motion.div variants={itemVariants} className="space-y-4">
          <motion.p 
            className="text-2xl md:text-3xl tracking-wide text-base-content/90"
            variants={itemVariants}
          >
            喜欢
            <span className="font-semibold text-[#00d8ff] mx-2">Java</span>
            <span className="font-semibold text-[#007acc]">React</span>
            <span className="ml-4 text-base-content/80">\owo/ ~</span>
          </motion.p>

          <motion.p
            className="text-xl md:text-2xl tracking-wide text-base-content/80"
            variants={itemVariants}
          >
            我会在这个网站记录感兴趣的内容，努力成为一名合格的程序员
          </motion.p>
        </motion.div>

        {/* 社交链接 */}
        <motion.div 
          className="flex justify-center mt-8 gap-6"
          variants={itemVariants}
        >
          <div className="relative group">
            <a 
              href="https://github.com/Zhiyong0105" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle text-base-content/80 
                       hover:text-base-content"
            >
              <FaGithub className="h-6 w-6" />
            </a>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                          bg-base-300/50 text-base-content text-sm py-1 px-3 rounded 
                          opacity-0 group-hover:opacity-100 transition-opacity">
              Github
            </div>
          </div>

          <div className="relative group">
            <a 
              href="https://space.bilibili.com/3101950" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle text-base-content/80 
                       hover:text-base-content"
            >
              <FaBilibili className="h-6 w-6" />
            </a>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                          bg-base-300/50 text-base-content text-sm py-1 px-3 rounded 
                          opacity-0 group-hover:opacity-100 transition-opacity">
              BiliBili
            </div>
          </div>

          <div className="relative group">
            <a 
              href="/article"
              className="btn btn-ghost btn-circle text-base-content/80 
                       hover:text-base-content"
            >
              <BiLogoBlogger className="h-6 w-6" />
            </a>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                          bg-base-300/50 text-base-content text-sm py-1 px-3 rounded 
                          opacity-0 group-hover:opacity-100 transition-opacity">
              Blog
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 装饰元素 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 这里可以添加背景装饰 */}
      </div>
    </div>
  );
}
