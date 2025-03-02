import React from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

export default function Editor({ value, onChange }) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        height={500}
        previewOptions={{
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        }}
        className="border rounded-lg"
      />
    </div>
  );
}