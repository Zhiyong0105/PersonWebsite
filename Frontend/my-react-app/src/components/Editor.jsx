import React, { useCallback, useRef, useState, useEffect } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { articleAPI } from "./api/article/article";

export default function Editor({ value, onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const editorRef = useRef(null);

  // 自定义粘贴图片处理
  const handleImagePaste = useCallback(async (dataTransfer, textAreaRef) => {
    if (!textAreaRef) return;
    
    // 检查剪贴板中是否有图片
    const items = dataTransfer?.items;
    if (!items) return false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // 只处理图片类型
      if (item.type.indexOf('image') !== -1) {
        setIsUploading(true);
        setUploadStatus("正在上传图片...");
        
        try {
          // 从剪贴板获取文件
          const file = item.getAsFile();
          
          // 生成一个唯一的文件名
          const timestamp = new Date().getTime();
          const fileName = `pasted_image_${timestamp}.png`;
          
          // 创建一个新的文件对象，以确保文件名正确
          const imageFile = new File([file], fileName, { type: file.type });
          
          // 上传图片到服务器 (使用'file'作为参数名，与后端@RequestParam("file")匹配)
          const response = await articleAPI.uploadImage(imageFile);
          
          // 记录返回的响应，便于调试
          console.log('Image upload response:', response);
          
          // 获取返回的URL
          // 处理返回结果，根据后端返回的格式提取URL
          const imageUrl = response.success === 1 && response.url ? response.url : response;
          
          if (!imageUrl) {
            throw new Error('未能获取到图片URL');
          }
          
          // 使用markdown格式插入图片
          const imageMarkdown = `![${fileName}](${imageUrl})`;
          
          // 获取当前选择的范围
          const start = textAreaRef.selectionStart;
          const end = textAreaRef.selectionEnd;
          
          // 在光标位置插入图片markdown
          const newValue = 
            value.substring(0, start) + 
            imageMarkdown + 
            value.substring(end);
          
          // 更新编辑器的值
          onChange(newValue);
          
          // 更新光标位置
          setTimeout(() => {
            const newPosition = start + imageMarkdown.length;
            textAreaRef.selectionStart = newPosition;
            textAreaRef.selectionEnd = newPosition;
            textAreaRef.focus();
          }, 0);
          
          setUploadStatus("图片上传成功");
          setTimeout(() => setUploadStatus(""), 3000);
          
          // 处理成功，阻止默认粘贴行为
          return true;
        } catch (error) {
          console.error('Failed to upload image:', error);
          setUploadStatus("图片上传失败，请重试");
          setTimeout(() => setUploadStatus(""), 3000);
        } finally {
          setIsUploading(false);
        }
        
        // 只处理第一个图片
        break;
      }
    }
    
    // 没有找到图片，使用默认粘贴行为
    return false;
  }, [value, onChange]);

  // 自定义命令集
  const customCommands = [
    ...commands.getCommands(),
    {
      name: "paste-image",
      keyCommand: "paste-image",
      buttonProps: { "aria-label": "Paste image" },
      handle: () => {
        // 这是一个占位命令，实际处理在组件的粘贴事件中
      }
    }
  ];

  // 使用useEffect钩子添加粘贴事件监听
  useEffect(() => {
    // 找到编辑器中的textarea元素
    if (editorRef.current) {
      const textareaElement = editorRef.current.querySelector('textarea');
      if (textareaElement) {
        // 添加粘贴事件监听器
        const pasteHandler = (e) => {
          const handled = handleImagePaste(e.clipboardData, textareaElement);
          if (handled) {
            e.preventDefault();
          }
        };
        
        textareaElement.addEventListener('paste', pasteHandler);
        
        // 清理函数
        return () => {
          textareaElement.removeEventListener('paste', pasteHandler);
        };
      }
    }
  }, [handleImagePaste, editorRef]);

  return (
    <div data-color-mode="light" ref={editorRef}>
      <MDEditor
        value={value}
        onChange={onChange}
        height={500}
        commands={customCommands}
        previewOptions={{
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        }}
        className="border rounded-lg"
      />
      <div className="flex justify-between mt-2 text-xs">
        <div className="text-gray-500">
          提示: 可直接粘贴截图到编辑器中自动上传
        </div>
        {uploadStatus && (
          <div className={`${isUploading ? 'text-blue-500' : (uploadStatus.includes('成功') ? 'text-green-500' : 'text-red-500')}`}>
            {uploadStatus}
          </div>
        )}
      </div>
    </div>
  );
}