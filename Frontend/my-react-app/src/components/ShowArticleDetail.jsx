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
    const text = match[2].trim();
    // 生成更可靠的ID，处理特殊字符和空格
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-') // 保留中文字符和英文字母数字
      .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
      .replace(/-{2,}/g, '-'); // 将多个连字符替换为单个

    headings.push({
      level: match[1].length,
      text: text,
      id: id
    });
  }

  return headings;
};

// 添加一个格式化时间的函数
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
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
  const [tocVisible, setTocVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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
        
        // 记录文章访问
        try {
          await articleAPI.recordArticleVisit(id);
        } catch (visitErr) {
          // 访问记录失败不影响文章显示
          console.error("Error recording article visit:", visitErr);
        }
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

  // 添加响应式检测
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // 在移动端自动隐藏TOC
      if (mobile) {
        setTocVisible(false);
      } else {
        setTocVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        {headings.length > 0 ? (
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
        ) : (
          <div className="text-center py-4 text-base-content/50 text-sm">
            没有找到标题
          </div>
        )}
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

            {/* 文章标题区域 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-primary/30 rounded-full" />
                <div>
                  <h1 className="text-3xl font-bold text-base-content">
                    {article.articleTitle}
                  </h1>
                  {article.articleSummary && (
                    <p className="mt-2 text-base-content/60">
                      {article.articleSummary}
                    </p>
                  )}
                </div>
              </div>

              {/* 文章元信息 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60">
                {article.updateTime && article.updateTime !== article.createTime ? (
                  <>
                    <time className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      发布于 {formatDateTime(article.createTime)}
                    </time>
                    <time className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      最后编辑于 {formatDateTime(article.updateTime)}
                    </time>
                  </>
                ) : (
                  <time className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    发布于 {formatDateTime(article.createTime)}
                  </time>
                )}
              </div>

              {/* 分隔线 */}
              <div className="mt-6 border-t border-base-200/50"></div>
            </div>

            {/* 文章主体 */}
            <article className="prose prose-base-content max-w-none prose-sm sm:prose-base">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeSlug]}
                components={{
                  h1: ({node, ...props}) => {
                    const id = props.children[0].toString()
                      .toLowerCase()
                      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                      .replace(/-{2,}/g, '-');
                    return <h1 id={id} className="text-2xl sm:text-3xl mt-8" {...props} />;
                  },
                  h2: ({node, ...props}) => {
                    const id = props.children[0].toString()
                      .toLowerCase()
                      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                      .replace(/-{2,}/g, '-');
                    return <h2 id={id} className="text-xl sm:text-2xl" {...props} />;
                  },
                  h3: ({node, ...props}) => {
                    const id = props.children[0].toString()
                      .toLowerCase()
                      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                      .replace(/-{2,}/g, '-');
                    return <h3 id={id} className="text-lg sm:text-xl" {...props} />;
                  },
                  h4: ({node, ...props}) => {
                    const id = props.children[0].toString()
                      .toLowerCase()
                      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                      .replace(/-{2,}/g, '-');
                    return <h4 id={id} {...props} />;
                  },
                  h5: ({node, ...props}) => {
                    const id = props.children[0].toString()
                      .toLowerCase()
                      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                      .replace(/-{2,}/g, '-');
                    return <h5 id={id} {...props} />;
                  },
                  h6: ({node, ...props}) => {
                    const id = props.children[0].toString()
                      .toLowerCase()
                      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                      .replace(/-{2,}/g, '-');
                    return <h6 id={id} {...props} />;
                  },
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
          <div className={`hidden lg:block transition-opacity duration-300 ${tocVisible ? 'opacity-100' : 'opacity-0'}`}>
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