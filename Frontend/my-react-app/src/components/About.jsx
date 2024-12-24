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
      </div>
    </div>
  );
};

export default About;
