// Register.jsx
import React from "react";

export default function Register  ({ toggleToLogin })  {
  return (
    <form className="w-4/5">
      <input
        type="text"
        placeholder="用户名"
        className="w-full bg-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
      />
      <input
        type="password"
        placeholder="密码"
        className="w-full bg-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
      />
      <input
        type="password"
        placeholder="确认密码"
        className="w-full bg-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
      >
        注册
      </button>
      <p
        className="text-center text-sm mt-4 text-blue-500 cursor-pointer hover:underline"
        onClick={toggleToLogin}
      >
        已有账号？去登录
      </p>
    </form>
  );
};


