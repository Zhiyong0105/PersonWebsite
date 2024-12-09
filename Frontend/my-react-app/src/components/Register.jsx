// Register.jsx
import React, { useState }from "react";
import { useNavigate } from "react-router-dom";

export default function Register  ({ toggleToLogin , setAlert, toggleToClose})  {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      username: event.target[0].value,
      password: event.target[1].value,
      email: event.target[3].value,
    };

    try {
      console.log("Sending request to backend:", formData);

      const response = await fetch("http://localhost:8080/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response received:", response);

      if (response.ok) {
        const result = await response.json();
        const { code, msg } = result;
        if (code === 200) {
          toggleToClose();
          navigate("/");
          
        } else {
          setAlert({ show: true, message: `注册失败: ${msg}`, type: "warning" });
        }
      } else {
        setAlert({ show: true, message: `请求失败: ${response.status}`, type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({ show: true, message: `网络错误: ${error.message}`, type: "error" });
    }
  };
  return (
    <form className="w-4/5" onSubmit={handleSubmit}>
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
      <input
        type="email"
        placeholder="邮箱"
        className="w-full bg-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
        // onClick={toggleToClose}
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