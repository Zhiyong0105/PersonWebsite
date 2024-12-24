import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { 
  FaCode, 
  FaDatabase, 
  FaGraduationCap, 
  FaBriefcase, 
  FaLaptopCode 
} from "react-icons/fa";

const About = () => {
  const skillsRef = useRef(null);
  const timelineRef = useRef(null);

  // 技能标签数据 - 分类
  const skills = {
    frontend: {
      title: "前端开发",
      icon: <FaCode className="text-2xl mb-2" />,
      skills: ["HTML", "CSS", "JavaScript", "React", "Vue", "Tailwind CSS", "TypeScript"]
    },
    backend: {
      title: "后端开发",
      icon: <FaDatabase className="text-2xl mb-2" />,
      skills: ["Python", "Node.js", "Docker", "MySQL", "MongoDB", "Redis", "Git"]
    }
  };

  // 经历时间轴数据
  const experiences = [
    {
      year: "2023",
      title: "Senior Developer",
      company: "Tech Company",
      description: "负责开发和维护核心业务系统",
      icon: <FaLaptopCode />
    },
    {
      year: "2021",
      title: "Full Stack Developer",
      company: "Start-up",
      description: "全栈开发，负责前后端开发工作",
      icon: <FaBriefcase />
    },
    {
      year: "2019",
      title: "Junior Developer",
      company: "IT Company",
      description: "参与多个Web应用开发项目",
      icon: <FaGraduationCap />
    }
  ];

  useEffect(() => {
    // 添加必要的CSS
    const style = document.createElement('style');
    style.textContent = `
      .show {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, observerOptions);

    if (skillsRef.current) observer.observe(skillsRef.current);
    if (timelineRef.current) observer.observe(timelineRef.current);

    return () => {
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-left mb-16 pl-4 text-base-content">关于我</h1>
        
        {/* 技能部分 */}
        <div 
          ref={skillsRef} 
          className="mb-32 opacity-0 transform translate-y-10 transition-all duration-1000 ease-out"
        >
          <h2 className="text-2xl font-semibold mb-12 text-base-content text-center">技能专长</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {Object.entries(skills).map(([key, category]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-base-200 p-6 rounded-xl shadow-lg"
              >
                <div className="text-center mb-6">
                  <div className="text-primary">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-base-content">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {category.skills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1,
                        ease: [0.6, -0.05, 0.01, 0.99]
                      }}
                      className="px-4 py-2 bg-base-100 rounded-full text-sm font-medium
                               text-base-content shadow-md hover:shadow-lg transition-all
                               duration-300 hover:scale-105 cursor-pointer"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 经历时间轴部分 */}
        <div 
          ref={timelineRef} 
          className="opacity-0 transform translate-y-10 transition-all duration-1000 ease-out text-center"
        >
          <h2 className="text-2xl font-semibold mb-12 text-base-content">工作经历</h2>
          <div className="relative max-w-4xl mx-auto">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: [0.6, -0.05, 0.01, 0.99]
                }}
                className={`flex items-center relative ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                } mb-16`}
              >
                {/* 时间点图标 - 移到主轴上 */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <div className="w-12 h-12 bg-base-100 rounded-full border-4 border-base-200
                                flex items-center justify-center shadow-lg
                                text-primary text-xl">
                    {exp.icon}
                  </div>
                </div>

                {/* 内容卡片 */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-base-200 p-6 rounded-lg shadow-md 
                              hover:shadow-xl transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold text-base-content">{exp.year}</h3>
                    <h4 className="text-lg font-semibold mt-2 text-base-content">{exp.title}</h4>
                    <p className="text-base-content/60">{exp.company}</p>
                    <p className="mt-3 text-base-content">{exp.description}</p>
                  </motion.div>
                </div>

                {/* 空白区域，保持布局平衡 */}
                <div className="w-5/12" />
              </motion.div>
            ))}

            {/* 时间轴竖线 */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-base-200
                          transform -translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
