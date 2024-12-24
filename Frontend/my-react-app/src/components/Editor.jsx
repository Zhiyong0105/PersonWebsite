import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import axiosInstance from "./Axios";

export default function Editor() {
  const [value, setValue] = useState("");
  const [summaryValue, setSummaryValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveArticle = async () => {
    if (!titleValue.trim()) {
      alert("请输入文章标题");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/article/publish", {
        articleTitle: titleValue,
        articleContent: value,
        articleSummary: summaryValue,
        status: 1
      });
      
      if (response.status === 200) {
        const { code, msg } = response.data;
        if (code === 200) {
          alert("发布成功！");
          // 可以在这里添加发布成功后的跳转逻辑
        } else {
          alert(msg || "发布失败，请重试");
        }
      }
    } catch (error) {
      console.error("Failed to save article:", error);
      alert("发布失败，请检查网络连接！");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-base-100 rounded-lg shadow-lg">
      {/* 标题区域 */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold mb-6">创建新文章</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">文章标题</label>
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              placeholder="请输入文章标题..."
              className="input input-bordered w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">文章摘要</label>
            <textarea
              value={summaryValue}
              onChange={(e) => setSummaryValue(e.target.value)}
              placeholder="请输入文章摘要..."
              className="textarea textarea-bordered w-full h-24"
            />
          </div>
        </div>
      </div>

      {/* Markdown 编辑器 */}
      <div className="p-6">
        <label className="block text-sm font-medium mb-2">文章内容</label>
        <div data-color-mode="light">
          <MDEditor
            value={value}
            onChange={setValue}
            height={500}
            previewOptions={{
              remarkPlugins: [remarkMath],
              rehypePlugins: [rehypeKatex],
            }}
            className="border rounded-lg"
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="p-6 border-t flex justify-end gap-4">
        <button 
          className="btn btn-ghost"
          onClick={() => {
            if (confirm("确定要取消编辑吗？")) {
              setValue("");
              setSummaryValue("");
              setTitleValue("");
            }
          }}
        >
          取消
        </button>
        <button
          className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
          onClick={saveArticle}
          disabled={isSubmitting}
        >
          {isSubmitting ? '发布中...' : '发布文章'}
        </button>
      </div>
    </div>
  );
}
