import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // 导入 Katex 样式
import axiosInstance from "./Axios";

export default function Editor() {
  const [value, setValue] = useState("");
  const [summaryvalue,setSummaryvalue] = useState("");
  const [titlevalue,setTitlevalue] = useState("");

  const saveArticle = async () => {
    try {
      const response = await axiosInstance.post("/article/publish", {
        articleTitle: titlevalue, // 示例标题
        articleContent: value,         // Markdown 内容
        articleSummary: summaryvalue,
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
  
    <div className="container mx-auto px-4 py-8" >
        <div className="flex flex-col items-center mb-6 space-y-4">
        <input
          type="text"
          placeholder="Article Title"
          value={titlevalue}
          onChange={(e) => setTitlevalue(e.target.value)}
          className="input input-bordered input-lg w-full max-w-lg"
        />
        <input
          type="text"
          placeholder="Article Summary"
          value={summaryvalue}
          onChange={(e) => setSummaryvalue(e.target.value)}
          className="input input-bordered input-lg w-full max-w-lg"
        />
      </div>
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
