import React, { useState } from "react";
import CustomAlert from "./CustomAlert";

export default function Register({ toggleToLogin }) {
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      username: event.target[0].value,
      password: event.target[1].value,
      confirmPassword: event.target[2].value,
    };

    try {
      console.log("Sending request to backend:", formData); // 调试输出

      const response = await fetch("http://localhost:8080/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response received:", response);
      if(response.ok){
        const result = await response.json();
        const { code , data , msg } = result ;
        if(code == 200){
          setAlert({ show: true, message: msg, type: "success" });
          // alert(msg);
        }else{
          alert("注册失败:"+ msg);
        }
      }else{
        alert("请求失败"+response.status)
      }
    } catch (error) {
      console.error("Error:", error);
      alert("网络错误：" + error.message);
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
}
