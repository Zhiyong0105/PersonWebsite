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
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5"; // 添加返回图标

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

// 新增：平滑滚动函数
const scrollToHeading = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80;
    window.scrollTo({
      top: element.offsetTop - offset,
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

  // 监听滚动，更新当前活动的标题
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentHeading = '';
      
      headingElements.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentHeading = heading.id;
        }
      });
      
      setActiveHeading(currentHeading);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Article not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* TOC 侧边栏 - 重新设计 */}
      <div className="hidden lg:block fixed right-8 top-24 w-72">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl"
        >
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between text-base-content mb-2 hover:text-primary transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd"/>
              </svg>
              <span className="font-bold text-lg">目录</span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isMenuOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: isMenuOpen ? 'auto' : 0,
              opacity: isMenuOpen ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {headings.map((heading, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
                >
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`
                      group w-full text-left py-2 px-3 rounded-lg transition-all duration-200
                      ${activeHeading === heading.id 
                        ? 'text-primary font-medium' 
                        : 'text-base-content/70 hover:text-base-content'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className={`
                          w-1 h-1 rounded-full transition-all duration-200
                          ${activeHeading === heading.id 
                            ? 'bg-primary scale-150' 
                            : 'bg-base-content/30 group-hover:bg-base-content/50'}
                        `}
                      />
                      <span className={`text-sm ${heading.level === 1 ? 'font-semibold' : ''}`}>
                        {heading.text}
                      </span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 文章内容部分 - 调整布局 */}
      <div className="max-w-3xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/article')}
          className="mb-6 flex items-center gap-2 px-3 py-1.5 text-base-content/70 
                   hover:text-primary transition-all duration-200 rounded-lg
                   hover:bg-base-200/50 text-sm group"
          aria-label="返回文章列表"
        >
          <IoArrowBack className="text-lg group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">返回文章列表</span>
        </button>

        {/* 文章标题和时间 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-3">
            {article.articleTitle}
          </h1>
          <p className="text-base-content/60">
            {article.createTime
              ? new Date(article.createTime).toLocaleString()
              : "Unknown"}
          </p>
        </div>

        {/* 文章内容 */}
        <div className="prose dark:prose-invert max-w-none p-6 rounded-lg">
          <ReactMarkdown
            children={article.articleContent}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeSlug]}
            components={{
              h1: ({node, ...props}) => <h1 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
              h2: ({node, ...props}) => <h2 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
              h3: ({node, ...props}) => <h3 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
              h4: ({node, ...props}) => <h4 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
              h5: ({node, ...props}) => <h5 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
              h6: ({node, ...props}) => <h6 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />
            }}
          />
        </div>
      </div>
      <FloatingButton />
    </div>
  );
}
