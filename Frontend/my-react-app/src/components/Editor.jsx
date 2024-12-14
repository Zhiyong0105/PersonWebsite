import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // 导入 Katex 样式
import axiosInstance from "./Axios";

export default function Editor() {
  const [value, setValue] = useState("");

  const saveArticle = async () => {
    try {
      const response = await axiosInstance.post("/article/auth/publish", {
        articleTitle: "Sample Article1", // 示例标题
        articleContent: value,         // Markdown 内容
        status: 1                      // 示例状态
      });
      if (response.status === 200) {
        const {code,data,msg} = response.data
        alert(response.data.msg);
      }
    } catch (error) {
      console.error("Failed to save article:", error);
      alert("Error saving article!");
    }
  };
  return (
    <div className="container" style={{ padding: "20px" }}>
      {/* Markdown 编辑器 */}
      <MDEditor
        value={value}
        onChange={setValue}
        previewOptions={{
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        }}
      />
      {/* Markdown 渲染 */}
      <MDEditor.Markdown
        source={value}
        style={{ whiteSpace: "pre-wrap" }}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      />
      <button className="btn" onClick={saveArticle}>
        提交
      </button>
    </div>
  );
}
