import { useParams } from "react-router-dom";
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

export default function ShowArticleDetail() {
  const { id } = useParams(); // 从路由中获取文章 ID
  const [article, setArticle] = useState(null); // 存储文章内容
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误状态
  const [showScrollTop, setShowScrollTop] = useState(false); // 控制回到顶部按钮显示

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axiosInstance.get(`/article/${id}`);
        const { code, msg, data } = response.data;
        if (code === 200) {
          setArticle(data); // 设置文章内容
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
    const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };





  if (!article) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Article not found.</p>
      </div>
    );
  }

    return (
      
    <div className="container mx-auto px-4 py-8">
      {/* <div className="fixed top-20 right-10 w-64 hidden lg:block">
        <MarkdownNavbar
          source={article.articleContent} // Markdown 内容
          ordered={false} // 是否显示有序列表
          headingTopOffset={60} // 滚动时标题的偏移量
        />
      </div> */}
      {/* 文章标题 */}
      <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
        {article.articleTitle}
      </h1>

      {/* 创建时间 */}
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {article.createTime
          ? new Date(article.createTime).toLocaleString()
          : "Unknown"}
      </p>

      {/* 章节目录 */}
      {/* <div className="mb-6 p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
        <ReactMarkdown
          children={article.articleContent}
          rehypePlugins={[
            rehypeSlug, // 给标题添加id
            [rehypeToc, { headings: ["h1", "h2", "h3"] }], // 生成目录
          ]}
        />
      </div> */}

      {/* 文章内容 */}
      <div className="prose dark:prose-invert max-w-none p-4 rounded shadow">
        <ReactMarkdown
          children={article.articleContent}
          remarkPlugins={[remarkMath,remarkGfm ]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
        />
      </div>
      <FloatingButton />
    </div>
   
  );
}
