import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { articleAPI } from './api/article/article';
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import Comments from './Comments';
import { IoMdCloseCircle } from "react-icons/io";

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

export default function ShowArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [showToc, setShowToc] = useState(false);

  // 滚动进度
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articleAPI.getArticle(id);
        setArticle(data);
        setHeadings(extractHeadings(data.articleContent));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // 添加滚动到指定标题的函数
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // 考虑顶部固定导航的高度
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  };

  // 添加监听滚动更新当前标题
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentHeading = '';
      
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
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeHeading]);

  // TOC 组件
  const TableOfContents = ({ className }) => (
    <div className={`bg-base-100/80 backdrop-blur-sm rounded-lg shadow-lg border border-base-200/50 ${className}`}>
      <div className="p-4 border-b border-base-200/50">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-base-content/80">目录</h3>
          <button 
            className="lg:hidden btn btn-ghost btn-sm btn-circle"
            onClick={() => setShowToc(false)}
          >
            <IoMdCloseCircle className="w-6 h-6"/>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {headings.map((heading, index) => (
            <div
              key={heading.id || index}
              style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
            >
              <button
                onClick={() => {
                  scrollToHeading(heading.id);
                  setShowToc(false);
                }}
                className={`
                  text-left w-full px-3 py-1.5 rounded-lg transition-all
                  group hover:bg-base-200/50
                  ${activeHeading === heading.id 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-base-content/70 hover:text-base-content'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`
                    w-1.5 h-1.5 rounded-full transition-colors
                    ${activeHeading === heading.id 
                      ? 'bg-primary' 
                      : 'bg-base-content/30 group-hover:bg-base-content/50'
                    }
                  `} />
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
  );

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-error">{error}</p>
      </div>
    );
  }

  // 文章不存在
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

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between">
          {/* 文章内容 */}
          <div className="flex-1 max-w-4xl mx-auto px-0 sm:px-4">
            {/* 返回按钮 */}
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-ghost btn-sm hover:bg-base-200/50 -ml-2"
              >
                <IoArrowBack className="w-4 h-4" />
                <span className="ml-1">返回</span>
              </button>
            </div>

            {/* 文章主体 */}
            <article className="prose prose-base-content max-w-none prose-sm sm:prose-base">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeSlug]}
                components={{
                  h1: ({node, ...props}) => <h1 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} className="text-2xl sm:text-3xl mt-8" {...props} />,
                  h2: ({node, ...props}) => <h2 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} className="text-xl sm:text-2xl" {...props} />,
                  h3: ({node, ...props}) => <h3 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} className="text-lg sm:text-xl" {...props} />,
                  h4: ({node, ...props}) => <h4 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                  h5: ({node, ...props}) => <h5 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                  h6: ({node, ...props}) => <h6 id={props.children[0].toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')} {...props} />,
                  p: ({node, ...props}) => <p className="text-sm sm:text-base" {...props} />,
                  li: ({node, ...props}) => <li className="text-sm sm:text-base" {...props} />
                }}
              >
                {article?.articleContent || ""}
              </ReactMarkdown>
            </article>

            {/* 评论组件 */}
            {article && <Comments articleId={id} />}
          </div>

          {/* 桌面端目录 */}
          <div className="hidden lg:block">
            <div className="fixed top-24 right-8 w-64">
              <TableOfContents />
            </div>
          </div>

          {/* 移动端目录按钮 */}
          <button
            onClick={() => setShowToc(true)}
            className="lg:hidden fixed right-6 bottom-6 btn btn-circle btn-primary shadow-lg"
            title="目录"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h7" 
              />
            </svg>
          </button>
        </div>
      </main>

      {/* 移动端目录抽屉 */}
      <AnimatePresence>
        {showToc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50"
          >
            <motion.div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowToc(false)}
            />
            <motion.div 
              className="absolute right-0 top-0 bottom-0 w-80 bg-base-100"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
            >
              <TableOfContents className="h-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}