import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "./Axios"; // 自定义的 Axios 实例
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight"; // 代码高亮插件
import remarkMath from "remark-math"; // 支持数学公式
import rehypeKatex from "rehype-katex"; // 支持数学公式渲染
import "highlight.js/styles/github.css"; // GitHub 风格的代码高亮
import "katex/dist/katex.min.css"; // 数学公式样式
import rehypeSlug from "rehype-slug";
// import remarkToc from 'remark-toc';
// import remarkGfm from "remark-gfm";
import FloatingButton from "./FloatingButton";
import MarkdownNavbar from 'markdown-navbar';
import remarkGfm from "remark-gfm";
import { motion, useScroll, useSpring } from "framer-motion";
import { IoArrowBack } from "react-icons/io5"; // 添加返回图标
import { FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Comments from './Comments';

// 解析标题的函数
const extractHeadings = (markdown) => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      id: match[2].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')
    });
  }

  return headings;
};

// 修改滚动函数以添加平滑效果
const scrollToHeading = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

export default function ShowArticleDetail() {
  const { id } = useParams(); // 从路由中获取文章 ID
  const [article, setArticle] = useState(null); // 存储文章内容
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误状态
  const [headings, setHeadings] = useState([]); // 添加 headings 状态
  const [activeHeading, setActiveHeading] = useState(""); // 添加 activeHeading 状态
  const [isMenuOpen, setIsMenuOpen] = useState(true); // 添加折叠控制状态
  const navigate = useNavigate(); // 添加导航钩子
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axiosInstance.get(`/article/${id}`);
        const { code, msg, data } = response.data;
        if (code === 200) {
          setArticle(data); // 设置文章内容
          // 解析文章内容中的标题
          setHeadings(extractHeadings(data.articleContent));
        } else {
          throw new Error(msg || "Failed to fetch the article");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false); // 加载完成
      }
    };

    fetchArticle();
  }, [id]);

  // 改进监听滚动，更新当前活动的标题
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentHeading = '';
      
      // 找到当前视窗中最上方的标题
      for (let heading of headingElements) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentHeading = heading.id;
        } else {
          break;
        }
      }
      
      if (currentHeading !== activeHeading) {
        setActiveHeading(currentHeading);
        
        // 在 TOC 中滚动到当前标题
        const activeElement = document.querySelector(`[data-heading-id="${currentHeading}"]`);
        if (activeElement) {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeHeading]);

  // 监听滚动位置来控制返回顶部按钮的显示
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight / 2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 滚动进度 - 现在可以正常使用了
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!article) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Article not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-base-100">
      {/* 进度条 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 btn btn-ghost btn-circle"
      >
        <IoArrowBack className="w-6 h-6" />
      </button>



      {/* 内容区域 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 文章内容 */}
          <article>
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeSlug]}
              components={{
                h1: ({node, ...props}) => <h1 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                h2: ({node, ...props}) => <h2 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                h3: ({node, ...props}) => <h3 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                h4: ({node, ...props}) => <h4 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                h5: ({node, ...props}) => <h5 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                h6: ({node, ...props}) => <h6 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />
              }}
            >
              {article?.articleContent || ""}
            </ReactMarkdown>
          </article>

          {/* 评论组件 - 只在文章加载完成后显示 */}
          {article && <Comments articleId={id} />}
        </div>
      </div>

      {/* TOC 侧边栏 - 可折叠 */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isMenuOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-16 right-0 w-72 max-h-[calc(100vh-4rem)] z-40 bg-base-100/95 
                   backdrop-blur-sm shadow-lg border-l border-base-200/50 hidden lg:block"
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-base-200/50">
            <h3 className="font-medium text-base-content/80">Contents</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 toc-scrollbar">
            <div className="space-y-2">
              {headings.map((heading, index) => (
                <div
                  key={index}
                  style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
                >
                  <button
                    data-heading-id={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`text-left w-full px-3 py-1.5 rounded-lg transition-all
                              ${activeHeading === heading.id 
                                ? 'bg-primary/10 text-primary font-medium' 
                                : 'hover:bg-base-200/50 text-base-content/70'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-1 h-1 rounded-full ${
                        activeHeading === heading.id 
                          ? 'bg-primary' 
                          : 'bg-base-content/30'
                      }`} />
                      <span className="text-sm line-clamp-1">
                        {heading.text}
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 固定按钮组 */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-2 items-center">
        {/* 评论按钮 */}
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            onClick={() => setShowComments(true)}
            className="p-2 bg-base-100/80 backdrop-blur-sm rounded-full shadow-lg 
                     border border-base-200/50 relative z-10"
          >
            <FaRegComment className="w-6 h-6 text-base-content/70 hover:text-primary transition-colors" />
          </motion.button>
          <div className="absolute inset-0 bg-primary/10 rounded-full blur group-hover:blur-md transition-all" />
        </motion.div>

        {/* 返回顶部按钮 */}
        <motion.div
          className="relative group"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: showScrollTop ? 1 : 0,
            scale: showScrollTop ? 1 : 0.5,
            pointerEvents: showScrollTop ? "auto" : "none"
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-primary/10 rounded-full blur group-hover:blur-md transition-all" />
          <div className="p-2 bg-base-100/80 backdrop-blur-sm rounded-full shadow-lg 
                       border border-base-200/50 cursor-pointer">
            <FloatingButton />
          </div>
        </motion.div>
      </div>
    </div>
  );
}