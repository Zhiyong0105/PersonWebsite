import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from "./Axios";
import MDEditor from "@uiw/react-md-editor";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
export default function ShowArticleDetail(){
    const { id } = useParams(); // 获取动态参数 :id
    const [article, setArticle] = useState(null);
    console.log(id);


      useEffect(() => {
    // 假设有一个 getArticleById 函数从后端获取文章数据
    const fetchArticle = async () => {
      const response = await axiosInstance.get(`/article/${id}`); 
      const {code,msg,data} = response.data;
      setArticle(data);
     
    };
        fetchArticle();
  }, [id]);


  if (!article) {
    return <p>Article not found.</p>; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-black mb-4">{article.articleTitle}</h1>
      <p className="text-gray-500">
        {article.createTime
          ? new Date(article.createTime).toLocaleString()
          : "Unknown"}
      </p>
      <div className="mt-6 p-4 rounded wmde-markdown-var">
        <MDEditor.Markdown
          source={article.articleContent}
          style={{ whiteSpace: "pre-wrap" }}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        />
        </div>
    </div>
  );
};
