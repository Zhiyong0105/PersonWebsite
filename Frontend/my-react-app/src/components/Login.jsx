import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignIn from "./SignIn";
import Register from "./Register";
import CustomAlert from "./CustomAlert";
export default function FloatingAuthModal({toggleToSwithUserButton}) {
  const [isOpen, setIsOpen] = useState(false); // 控制模态框是否打开
  const [isRegister, setIsRegister] = useState(false); // 当前是否为注册状态
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });


  const toggleToLogin = () => {
    setIsRegister(false);
  };

  const toggleToRegister = () => {
    setIsRegister(true);
  };
  const toggleToClose = () =>{
    setIsOpen(false);
  }
  return (
    <div className="flex   ">
      {/* 打开模态框的按钮 */}
      <button
        className="btn bg-transparent w-24 flex items-center justify-center space-x-2"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex justify-center items-center space-x-2">
  <span className="text-slate-500 text-sm">Log in</span>
  {/* <span aria-hidden="true" className="text-slate-500 text-sm">&rarr;</span> */}
        </div>

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
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {alert.show && (
              <div className=" absolute top-4 left-1/2 transform -translate-x-1/2 z-50  p-4 ">
                <CustomAlert
                  message={alert.message}
                  type={alert.type}
                  onClose={() => setAlert({ show: false, message: "", type: "" })}
                />
              </div>
            )}           
            {/* 关闭按钮 */}
            <button
              className="absolute top-4 right-4 z-50 btn btn-circle btn-outline btn-sm"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* 左侧动态部分 */}
            <motion.div
              className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-t ${
                isRegister
                  ? "from-blue-100 to-blue-300"
                  : "from-pink-100 to-pink-300"
              } flex flex-col items-center justify-center`}
              initial={{ x: isRegister ? "100%" : "0%", opacity: 0 }}
              animate={{ x: isRegister ? "100%" : "0%", opacity: 1 }}
              exit={{ x: isRegister ? "100%" : "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <h1 className="text-3xl font-bold text-gray-800 text-center">
                {!isRegister ? "欢迎回来" : "欢迎"}
              </h1>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {!isRegister ? "登录以继续" : "加入我们！"}
              </p>
            </motion.div>

            {/* 右侧动态表单部分 */}
            <motion.div
              className="absolute top-0 right-0 w-1/2 h-full bg-white flex flex-col items-center justify-center"
              initial={{ x: isRegister ? "-100%" : "0%", opacity: 0 }}
              animate={{ x: isRegister ? "-100%" : "0%", opacity: 1 }}
              exit={{ x: isRegister ? "-100%" : "100%", opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              key={isRegister ? "register" : "login"}
            >
              <h2 className="text-xl font-bold mb-6 text-center">
                {isRegister ? "注册" : "登录"}
              </h2>
              <div className="w-4/5 flex flex-col items-center">
                {isRegister ? (
                  <Register toggleToLogin={toggleToLogin} setAlert={setAlert} toggleToClose={toggleToClose}/>
                ) : (
                  <SignIn toggleToRegister={toggleToRegister} toggleToSwithUserButton={toggleToSwithUserButton} setAlert={setAlert}/>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    </div>
  );
}