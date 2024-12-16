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
      const response = await axiosInstance.post("/article/publish", {
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
    <div className="container" style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* 左侧 Markdown 编辑器 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h3>Markdown 编辑器</h3>
        <MDEditor
          value={value}
          onChange={setValue}
          previewOptions={{
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
          }}
        />
        <button className="btn" style={{ marginTop: "10px" }} onClick={saveArticle}>
          提交
        </button>
      </div>


    </div>
  );
}
