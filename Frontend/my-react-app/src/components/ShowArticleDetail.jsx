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
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

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

  // 获取评论列表
  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/api/comments/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // 提交评论
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await axiosInstance.post(`/api/comments/${id}`, { content: comment });
      setComment("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

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

      {/* TOC 切换按钮 */}
      {/* <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-4 z-50 btn btn-ghost btn-circle"
      >
        <span className="text-lg">≡</span>
      </button> */}

      {/* 内容区域 */}
      <div className="container mx-auto px-4 py-8">
        {/* 文章内容 - 居中显示 */}
        <div className="max-w-3xl mx-auto prose">
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

      {/* 评论抽屉 - 修复评论功能 */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: showComments ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 w-96 bg-base-100 shadow-xl z-50"
      >
        <div className="h-full flex flex-col">
          {/* 评论头部 */}
          <div className="p-4 border-b border-base-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="p-2 hover:bg-base-200 rounded-full transition-colors"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          {/* 评论列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-base-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    {comment.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-sm text-base-content/60">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-base-content/80">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* 评论输入框 */}
          <form onSubmit={handleSubmitComment} className="p-4 border-t border-base-200">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full h-24 p-3 rounded-lg bg-base-200 resize-none focus:outline-none 
                       focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              className="mt-2 w-full btn btn-primary"
              disabled={!comment.trim()}
            >
              Post Comment
            </button>
          </form>
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