import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingAuthModal() {
  const [isOpen, setIsOpen] = useState(false); // 控制模态框是否打开
  const [isRegister, setIsRegister] = useState(false); // 控制登录/注册状态

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-pink-200 to-blue-200">
      {/* 打开模态框的按钮 */}
      <button
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition"
        onClick={() => setIsOpen(true)}
      >
        打开登录/注册
      </button>

      {/* 模态框 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 模态框内容 */}
            <motion.div
              className="relative flex w-[900px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 关闭按钮 */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>

              {/* 左侧部分 */}
              <div className="flex flex-col items-center justify-center w-1/2 h-full bg-gradient-to-t from-pink-100 to-blue-100">
                <h1 className="text-3xl font-bold text-gray-800">WELCOME</h1>
                <p className="text-sm text-gray-600 mt-2">JOIN US!</p>
              </div>

              {/* 右侧表单部分 */}
              <div className="relative w-1/2 h-full overflow-hidden">
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center w-full h-full bg-white shadow-lg rounded-lg"
                  initial={{ x: isRegister ? "100%" : "-100%" }}
                  animate={{ x: "0%" }}
                  exit={{ x: isRegister ? "-100%" : "100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  key={isRegister ? "register" : "login"}
                >
                  <h2 className="text-xl font-bold mb-6">
                    {isRegister ? "注册" : "登录"}
                  </h2>
                  <form className="w-4/5">
                    {isRegister ? (
                      <>
                        <input
                          type="text"
                          placeholder="用户名"
                          className="w-full bg-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                          type="password"
                          placeholder="密码"
                          className="w-full bg-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                          type="password"
                          placeholder="确认密码"
                          className="w-full bg-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                        >
                          注册
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="用户名"
                          className="w-full bg-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                          type="password"
                          placeholder="密码"
                          className="w-full bg-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                        >
                          登录
                        </button>
                        <p
                          className="text-center text-sm mt-4 text-blue-500 cursor-pointer hover:underline"
                          onClick={toggleForm}
                        >
                          没有账号？去注册
                        </p>
                      </>
                    )}
                  </form>
                  {isRegister && (
                    <p
                      className="text-center text-sm mt-4 text-blue-500 cursor-pointer hover:underline"
                      onClick={toggleForm}
                    >
                      已有账号？去登录
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
