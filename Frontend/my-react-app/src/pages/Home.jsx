import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Projects from "../components/Projects";
import About from "../components/About";
import Experience from "../components/Experience";
import SimpleArticleList from "../components/SimpleArticleList";
import FloatingButton from "../components/FloatingButton";
import ThemeController from "../components/ThemeController";
import HeroAnimation from "../components/HeroAnimation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { IoArrowDown } from "react-icons/io5";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const homeRef = useRef(null);
  const projectsRef = useRef(null);
  const blogRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sectionRefs = {
    home: homeRef,
    project: projectsRef,
    blog: blogRef,
    about: aboutRef,
    experience: experienceRef,
  };

  // 滚动到指定section
  const scrollToSection = (sectionName) => {
    sectionRefs[sectionName]?.current?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(sectionName);
  };

  // 监听滚动位置来更新当前section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px",
        threshold: 0,
      }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  // 监听滚动位置来控制返回顶部按钮的显示
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight / 2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 滚动进度
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative bg-base-100 flex flex-col min-h-screen">
      {/* 导航栏 - 移除磨砂效果 */}
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* 移除背景层 */}
        <div className="relative">
          {/* 进度条 */}
          <motion.div
            className="h-[2px] bg-gradient-to-r from-primary to-secondary origin-left"
            style={{ scaleX }}
          />
          
          {/* 导航内容 - 移除背景和模糊效果 */}
          <nav className="py-4">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between">
                {/* Logo 和移动端菜单融合 */}
                <div className="flex items-center gap-3">
                  <motion.a 
                    className="text-xl font-bold bg-clip-text text-transparent 
                             bg-gradient-to-r from-primary to-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Portfolio
                  </motion.a>
                  
                  {/* 移动端菜单按钮 - 紧贴在 Portfolio 右侧 */}
                  <div className="sm:hidden">
                    <Navbar page={`#${activeSection}`} onSectionClick={scrollToSection} />
                  </div>
                </div>

                {/* 桌面端中间导航 */}
                <div className="hidden sm:block">
                  <Navbar page={`#${activeSection}`} onSectionClick={scrollToSection} />
                </div>

                {/* 右侧按钮 */}
                <div className="flex items-center gap-4">
                  <ThemeController />
                  <motion.a 
                    href="/blog"
                    className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 
                             text-primary transition-all duration-300 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Blog
                  </motion.a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* 主内容区 - 修改为 flex-1 确保 footer 在底部 */}
      <main className="flex-1">
        {/* Hero Section - 调整高度和布局 */}
        <section 
          ref={homeRef} 
          id="home" 
          className="h-screen flex items-center justify-center relative"
        >
          <div className="absolute inset-0">
            <HeroAnimation />
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <motion.button
              onClick={() => scrollToSection('project')}
              className="text-base-content/50 hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <IoArrowDown className="w-6 h-6" />
            </motion.button>
          </div>
        </section>

        {/* Projects Section - 减少上下内边距 */}
        <section 
          ref={projectsRef} 
          id="project" 
          className="py-16 bg-gradient-to-b from-base-200/50 to-base-100"
        >
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold text-center mb-10 bg-clip-text 
                       text-transparent bg-gradient-to-r from-primary to-secondary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Projects
            </motion.h2>
            <Projects />
          </div>
        </section>

        {/* Blog Section - 新增 */}
        <section 
          ref={blogRef} 
          id="blog" 
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Posts</h2>
                <p className="text-xl text-gray-600">
                  分享技术见解与编程经验
                </p>
              </div>
              <SimpleArticleList />
            </motion.div>
          </div>
        </section>

        {/* About Section - 减少上下内边距 */}
        <section 
          ref={aboutRef} 
          id="about" 
          className="py-16"
        >
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold text-center mb-10 bg-clip-text 
                       text-transparent bg-gradient-to-r from-primary to-secondary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              About
            </motion.h2>
            <About />
          </div>
        </section>

        {/* Experience Section - 减少上下内边距 */}
        <section 
          ref={experienceRef} 
          id="experience" 
          className="py-16 bg-gradient-to-b from-base-100 to-base-200/50"
        >
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold text-center mb-10 bg-clip-text 
                       text-transparent bg-gradient-to-r from-primary to-secondary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Experience
            </motion.h2>
            <Experience />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* 浮动按钮 */}
      <FloatingButton 
        showScrollTop={showScrollTop}
        onScrollToTop={() => scrollToSection('home')}
      />
    </div>
  );
}
