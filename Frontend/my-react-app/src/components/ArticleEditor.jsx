import { useState } from "react";
import Editor from "./Editor";

export default function ArticleEditor() {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  return (
    <div className="h-full">
      {/* 顶部操作栏 */}
      <div className="bg-base-100 rounded-xl shadow-sm h-full flex flex-col w-full">
        <div className="px-4 lg:px-6 py-4 border-b border-base-200/80 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-base-content">创建文章</h1>
              <p className="text-sm text-base-content/60 mt-1">撰写新的博客文章</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-ghost btn-sm">
                保存草稿
              </button>
              <button className="btn btn-primary btn-sm">
                发布文章
              </button>
            </div>
          </div>
        </div>

        {/* 编辑器和设置区域 */}
        <div className="flex-1 h-full">
          <div className="h-full flex gap-6">
            {/* 主编辑区域 */}
            <div className="flex-1 p-4 lg:p-6 ">
              <div className="bg-base-200/50 h-full rounded-lg">
                <Editor />
              </div>
            </div>

            {/* 侧边设置面板 - 移动端可折叠 */}
            <div className={`
              w-80 bg-base-100 p-4 flex-shrink-0
              fixed lg:relative right-0 top-[64px] lg:top-0 h-[calc(100vh-64px)] lg:h-auto
              transform transition-transform duration-300
              ${isSettingsPanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              z-20 lg:z-0 shadow-sm
            `}>
              {/* 移动端折叠按钮 */}
              <button 
                className="lg:hidden absolute -left-10 top-4 btn btn-circle btn-sm btn-ghost bg-base-100"
                onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform duration-300 ${isSettingsPanelOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* 文章设置面板 */}
              <div className="collapse collapse-arrow bg-base-100 rounded-lg border border-base-200">
                <input type="checkbox" /> 
                <div className="collapse-title p-4 min-h-0 py-3">
                  <h3 className="text-sm font-medium">文章设置</h3>
                </div>
                <div className="collapse-content px-4 pb-4">
                  <div className="space-y-3">
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text">发布状态</span>
                      </label>
                      <select className="select select-bordered select-sm w-full">
                        <option>公开发布</option>
                        <option>私密发布</option>
                        <option>草稿</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text">分类</span>
                      </label>
                      <select className="select select-bordered select-sm w-full">
                        <option>技术</option>
                        <option>生活</option>
                        <option>其他</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text">标签</span>
                      </label>
                      <input 
                        type="text" 
                        className="input input-bordered input-sm" 
                        placeholder="输入标签，用逗号分隔"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 移动端遮罩层 */}
            {isSettingsPanelOpen && (
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
                onClick={() => setIsSettingsPanelOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 