import { useState } from "react";
import { motion } from "framer-motion";

export default function Example() {
    const [isOpen, setIsOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <>
      <button
        className="mt-10 rounded-md bg-indigo-600 px-4 py-2 text-white"
        onClick={() => setIsOpen(true)}
      >
        Open Sign In Modal
      </button>

      {isOpen && (
        // <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
        //   <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        //     <button
        //       className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        //       onClick={() => setIsOpen(false)}
        //     >
        //       ✕
        //     </button>
        //     <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        //       <img
        //         alt="Your Company"
        //         src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
        //         className="mx-auto h-10 w-auto"
        //       />
        //       <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        //         Sign in to your account
        //       </h2>
        //     </div>

        //     <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        //       <form action="#" method="POST" className="space-y-6">
        //         <div>
        //           <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
        //             Email address
        //           </label>
        //           <div className="mt-2">
        //             <input
        //               id="email"
        //               name="email"
        //               type="email"
        //               required
        //               autoComplete="email"
        //               className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        //             />
        //           </div>
        //         </div>

        //         <div>
        //           <div className="flex items-center justify-between">
        //             <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
        //               Password
        //             </label>
        //             <div className="text-sm">
        //               <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
        //                 Forgot password?
        //               </a>
        //             </div>
        //           </div>
        //           <div className="mt-2">
        //             <input
        //               id="password"
        //               name="password"
        //               type="password"
        //               required
        //               autoComplete="current-password"
        //               className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        //             />
        //           </div>
        //         </div>

        //         <div>
        //           <button
        //             type="submit"
        //             className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        //           >
        //             Sign in
        //           </button>
        //         </div>
        //       </form>

        //       <p className="mt-10 text-center text-sm/6 text-gray-500">
        //         Not a member?{' '}
        //         <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
        //           Start a 14 day free trial
        //         </a>
        //       </p>
        //     </div>
        //   </div>
        // </div>
        <div className="h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-pink-200 to-blue-200">
            <div className="relative z-10 flex items-center justify-center box w-[1050px] h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
                
                <motion.div
                    className={`absolute top-0 left-0 pre-box flex flex-col items-center justify-center ${
                        isRegister ? "-translate-x-full" : "translate-x-0"
                        }`}
                        transition={{ duration: 0.5 }}
                >
                <h1 className="text-white text-3xl tracking-widest text-shadow-md">
                         Welcome Back!
                </h1>
                <p className="text-white font-semibold mt-4">去登录吧！</p>
                <button
                    onClick={toggleForm}
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                >
                    SIGN IN
                </button>
                </motion.div>
            <motion.div
                className={`absolute left-0 flex flex-col items-center justify-center w-1/2 h-full transition-transform ${
                    isRegister ? "-translate-x-full" : "translate-x-0"
                }`}
                >
                <h1 className="text-gray-800 text-2xl font-bold mb-6">登录</h1>
                <form className="input-box w-full">
                    <input
                    type="text"
                    placeholder="用户名"
                    className="w-[70%] bg-gray-200 p-3 rounded-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                    type="password"
                    placeholder="密码"
                    className="w-[70%] bg-gray-200 p-3 rounded-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition"
                    >
                    登录
                    </button>
                </form>
                <p
                    className="mt-6 text-gray-600 cursor-pointer hover:underline"
                    onClick={toggleForm}
                >
                    没有账号？去注册
                </p>
            </motion.div>
        <motion.div
          className={`absolute left-1/2 flex flex-col items-center justify-center w-1/2 h-full transition-transform ${
            isRegister ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <h1 className="text-gray-800 text-2xl font-bold mb-6">注册</h1>
          <form className="input-box w-full">
            <input
              type="text"
              placeholder="用户名"
              className="w-[70%] bg-gray-200 p-3 rounded-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="密码"
              className="w-[70%] bg-gray-200 p-3 rounded-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="确认密码"
              className="w-[70%] bg-gray-200 p-3 rounded-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition"
            >
              注册
            </button>
          </form>
          <p
            className="mt-6 text-gray-600 cursor-pointer hover:underline"
            onClick={toggleForm}
          >
            已有账号？去登录
          </p>
        </motion.div>
            </div>
        </div>
      )}
    </>
  );
}
