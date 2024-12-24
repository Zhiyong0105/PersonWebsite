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
    {
      title: "高级前端开发工程师",
      company: "某科技公司",
      date: "2022 - 至今",
      type: "work",
      description: "负责公司核心产品的前端架构设计和开发，带领团队完成多个重要项目。",
      icon: FaBriefcase,
      side: "right"
    },
    {
      title: "计算机科学与技术",
      company: "某大学",
      date: "2018 - 2022",
      type: "education",
      description: "主修计算机科学与技术，专注于Web开发和人工智能方向。",
      icon: FaGraduationCap,
      side: "left"
    },
    {
      title: "前端开发工程师",
      company: "某互联网公司",
      date: "2020 - 2022",
      type: "work",
      description: "参与多个大型Web应用的开发，负责用户界面设计和实现。",
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
      className="relative flex items-center mb-24"
    >
      {/* 左侧内容 */}
      <div className="w-1/2 pr-12 text-right">
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
      <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="w-12 h-12 bg-base-100 rounded-full border-4 border-primary flex items-center justify-center shadow-lg"
        >
          <exp.icon className="w-5 h-5 text-primary" />
        </motion.div>
      </div>

      {/* 右侧内容 */}
      <div className="w-1/2 pl-12">
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
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-16 text-base-content">
          My Experience
        </h1>

        {/* 时间轴部分 */}
        <div className="relative" ref={timelineRef}>
          {/* 中间的时间轴线 - 带动画效果 */}
          <motion.div
            style={{ scaleY }}
            className="absolute left-1/2 h-full w-0.5 bg-primary origin-top transform -translate-x-1/2"
          />

          {/* 静态背景线 */}
          <div className="absolute left-1/2 h-full w-0.5 bg-base-200 transform -translate-x-1/2" />

          {experiences.map((exp, index) => (
            <TimelineItem key={index} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
} 