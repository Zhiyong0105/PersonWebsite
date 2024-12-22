import React from "react";
import { CiSearch } from "react-icons/ci";

export default function SearchModal({ isOpen, closeModal }) {
  return (
    <div>
      {/* 模态框 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal} // 点击背景触发关闭
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-0"
            onClick={(e) => e.stopPropagation()} // 阻止冒泡，防止点击内容区域关闭模态框
          >
            {/* 模态框头部 */}
            <div className="p-4 border-b">
              <div className="relative">
                {/* 搜索输入框 */}
                <input
                  type="text"
                  className="w-full border rounded-lg py-2 px-3 pl-10 focus:ring focus:ring-indigo-200 focus:outline-none"
                  placeholder="Search documentation..."
                />

                {/* 搜索图标 */}
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <CiSearch className="h-6 w-6" />
                </span>

                {/* ESC 按钮 */}
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <button
                    className="flex items-center justify-center text-gray-400 hover:text-black"
                    onClick={closeModal}
                  >
                    <kbd className="kbd kbd-sm bg-gray-200 text-gray-600">esc</kbd>
                  </button>
                </span>
              </div>
            </div>

            {/* 模态框内容 */}
            <div className="p-4">
              <p className="text-gray-500 text-sm">Start typing to search...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
