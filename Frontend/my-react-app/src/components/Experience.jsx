import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { FaGraduationCap, FaBriefcase, FaLaptopCode } from "react-icons/fa";

export default function Experience() {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });

  // 使用 spring 让滚动更平滑
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 工作经历数据
  const experiences = [
    // {
    //   title: "高级前端开发工程师",
    //   company: "某科技公司",
    //   date: "2022 - 至今",
    //   type: "work",
    //   description: "负责公司核心产品的前端架构设计和开发，带领团队完成多个重要项目。",
    //   icon: FaBriefcase,
    //   side: "right"
    // },
    {
      title: "修士",
      company: "電気通信大学",
      date: "2024 - 現在",
      type: "education",
      description: "情報ネットワーク専攻、数値計算、並列計算",
      icon: FaGraduationCap,
      side: "left"
    },
    {
      title: "学部生",
      company: "電気通信大学",
      date: "2020 - 2024",
      type: "student",
      description: "情報系専攻",
      icon: FaLaptopCode,
      side: "right"
    }
  ];

  const TimelineItem = ({ exp, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative flex items-center mb-12 md:mb-24"
    >
      {/* 桌面端左侧内容 */}
      <div className="hidden md:block w-1/2 pr-12 text-right">
        {exp.side === "left" && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-base-200/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-end gap-2 mb-3">
              <span className="text-sm text-base-content/60">{exp.date}</span>
            </div>
            <h4 className="text-lg font-semibold text-base-content">{exp.title}</h4>
            <p className="text-base-content/60 mt-1">{exp.company}</p>
            <p className="text-base-content mt-3">{exp.description}</p>
          </motion.div>
        )}
      </div>

      {/* 中间图标 */}
      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="w-10 h-10 md:w-12 md:h-12 bg-base-100 rounded-full border-3 md:border-4 border-primary flex items-center justify-center shadow-lg"
        >
          <exp.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        </motion.div>
      </div>

      {/* 桌面端右侧内容 */}
      <div className="hidden md:block w-1/2 pl-12">
        {exp.side === "right" && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-base-200/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-base-content/60">{exp.date}</span>
            </div>
            <h4 className="text-lg font-semibold text-base-content">{exp.title}</h4>
            <p className="text-base-content/60 mt-1">{exp.company}</p>
            <p className="text-base-content mt-3">{exp.description}</p>
          </motion.div>
        )}
      </div>

      {/* 移动端内容 - 统一显示在右侧 */}
      <div className="md:hidden w-full pl-16">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="bg-base-200/50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-base-content/60">{exp.date}</span>
          </div>
          <h4 className="text-base font-semibold text-base-content">{exp.title}</h4>
          <p className="text-base-content/60 mt-1 text-sm">{exp.company}</p>
          <p className="text-base-content mt-2 text-sm">{exp.description}</p>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-16 text-base-content">
          My Experience
        </h1>

        {/* 时间轴部分 */}
        <div className="relative" ref={timelineRef}>
          {/* 中间的时间轴线 - 带动画效果 */}
          <motion.div
            style={{ scaleY }}
            className="absolute left-4 md:left-1/2 h-full w-0.5 bg-primary origin-top transform md:-translate-x-1/2"
          />

          {/* 静态背景线 */}
          <div className="absolute left-4 md:left-1/2 h-full w-0.5 bg-base-200 transform md:-translate-x-1/2" />

          {experiences.map((exp, index) => (
            <TimelineItem key={index} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
} 