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
import { 
  ArrowLeftIcon,
  CalendarDaysIcon,
  EyeIcon,
  ClockIcon,
  TagIcon,
  ListBulletIcon
} from "@heroicons/react/24/outline";
import Comments from './Comments';

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
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatVisitCount = (count) => {
  if (!count) return '0';
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};

export default function ShowArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
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

  // 监听滚动更新当前标题
  useEffect(() => {
    const handleScroll = () => {
      let currentHeading = "";
      const offset = 100;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= offset) {
          currentHeading = heading.id;
        }
      }

      setActiveHeading(currentHeading);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // 目录组件
  const TableOfContents = () => (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">目录</h4>
      {headings.length > 0 ? (
        <div className="space-y-1">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => {
                scrollToHeading(heading.id);
                setShowToc(false);
              }}
              className={`
                text-left w-full text-sm transition-colors duration-200
                ${heading.level === 1 ? 'pl-0' : 
                  heading.level === 2 ? 'pl-3' : 
                  heading.level === 3 ? 'pl-6' : 'pl-9'
                }
                ${activeHeading === heading.id 
                  ? 'text-gray-900 font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {heading.text}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm">
          没有找到标题
        </div>
      )}
    </div>
  );

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章加载失败</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  // 文章不存在
  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章不存在</h1>
          <p className="text-gray-600 mb-6">您访问的文章可能已被删除或不存在</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 进度条 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gray-900 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* 返回按钮 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>
        </motion.div>

        {/* 文章头部 */}
        <motion.header 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.articleTitle}
          </h1>
          
          {article.articleSummary && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {article.articleSummary}
            </p>
          )}

          {/* 文章元信息 */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Published on {formatDateTime(article.createTime)}</span>
            </div>
            
            {article.updateTime && article.updateTime !== article.createTime && (
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                <span>Updated on {formatDateTime(article.updateTime)}</span>
              </div>
            )}
            
            {article.category && (
              <div className="flex items-center gap-2">
                <TagIcon className="h-4 w-4" />
                <span className="text-gray-700 font-medium">{article.category}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4" />
              <span>{formatVisitCount(article.visitCount)} views</span>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 文章内容 */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <article className="prose prose-lg prose-gray max-w-none prose-headings:scroll-mt-20 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:leading-relaxed prose-a:text-gray-900 prose-a:no-underline hover:prose-a:underline prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-blockquote:border-l-gray-300 prose-blockquote:bg-gray-50 prose-blockquote:not-italic">
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
                    return <h1 id={id} {...props} />;
                  },
                  h2: ({node, ...props}) => {
                    const id = props.children[0].toString()
                      .toLowerCase()
                      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                      .replace(/-{2,}/g, '-');
                    return <h2 id={id} {...props} />;
                  },
                  h3: ({node, ...props}) => {
                    const id = props.children[0].toString()
                      .toLowerCase()
                      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                      .replace(/^-+|-+$/g, '')
                      .replace(/-{2,}/g, '-');
                    return <h3 id={id} {...props} />;
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
                  }
                }}
              >
                {article?.articleContent || ""}
              </ReactMarkdown>
            </article>

            {/* 评论组件 */}
            <div className="mt-16 pt-12 border-t border-gray-200">
              <Comments articleId={id} />
            </div>
          </motion.div>

          {/* 侧边栏 - 目录 */}
          {headings.length > 0 && (
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="lg:sticky lg:top-8 space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <TableOfContents />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 移动端目录按钮 */}
        {headings.length > 0 && (
          <>
            <button
              onClick={() => setShowToc(true)}
              className="lg:hidden fixed right-6 bottom-6 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
              title="目录"
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>

            {/* 移动端目录弹窗 */}
            <AnimatePresence>
              {showToc && (
                <motion.div
                  className="lg:hidden fixed inset-0 z-50 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="absolute inset-0 bg-black/20" onClick={() => setShowToc(false)} />
                  <motion.div
                    className="absolute right-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-xl overflow-y-auto"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">目录</h3>
                        <button
                          onClick={() => setShowToc(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <TableOfContents />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}