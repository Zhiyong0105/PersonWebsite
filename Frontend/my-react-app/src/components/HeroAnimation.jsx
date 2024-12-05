import { motion } from "framer-motion";
import TypeIntro from "./TypeIntro";

export default function HeroAnimation() {
  const containerVariants = {
    hidden: { opacity: 0 }, // 初始状态
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 子元素的动画依次延迟 0.2 秒
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // 子元素初始状态：透明度为0，向下偏移20px
    visible: {
      opacity: 1,
      y: 0, // 最终状态：完全可见，位置复原
      transition: { ease: "easeInOut", duration: 1 }, // 动画持续时间
    },
  };

  return (
    <motion.div
      className="flex min-h-full max-w-screen-md flex-col justify-center gap-5 px-6 md:px-10 2xl:max-w-7xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.p
        className="text-2xl tracking-widest md:text-4xl"
        variants={itemVariants}
      >
        Hi, I'm
      </motion.p>

    <motion.strong
    className="text-highlight" // 替换为渐变样式
    variants={itemVariants}
    >
    Abstract P
    </motion.strong>

      <motion.div variants={itemVariants}>
        <TypeIntro />
      </motion.div>

      <motion.p
        className="text-2xl md:text-5xl tracking-widest"
        variants={itemVariants}
      >
        喜欢
        <span className="font-semibold text-[#00d8ff]">Java</span>、
        <span className="font-semibold text-[#007acc]">React</span>
        <span className="ml-4">\owo/ ~</span>
      </motion.p>

      <motion.p
        className="text-2xl md:text-5xl tracking-widest"
        variants={itemVariants}
      >
        我在这个网站记录我的成长，努力 💪 成为一个更好的程序员。
      </motion.p>
    </motion.div>
  );
}
