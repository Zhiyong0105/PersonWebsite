// Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./Axios"
import qs from  "qs";
export default function SignIn ({ toggleToRegister,setAlert,toggleToSwithUserButton}) {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      username: event.target[0].value,
      password: event.target[1].value,
    };

    try {
      console.log("Sending request to backend:", formData);

      // 使用 Axios 实例发送 POST 请求
      // const response = await axiosInstance.post("/user/login", formData);
      const response = await axiosInstance.post(
            "/user/login",
            qs.stringify(formData), // 序列化表单数据
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
      const { code, msg, data } = response.data;

      if (code === 200) {
        const { token } = data;

        // 将 token 保存到 localStorage
        localStorage.setItem("token", token);
        // 登录成功后跳转
        toggleToSwithUserButton();
        // window.location.reload();
        navigate("/home");
      } else {
        // 显示警告信息
        setAlert({ show: true, message: `登陆失败: ${msg}`, type: "warning" });
      }
    } catch (error) {
      // 处理网络错误或后端错误
      console.error("Error:", error);
      const errorMessage = error.response
        ? `请求失败: ${error.response.status} - ${error.response.data.msg}`
        : `网络错误: ${error.message}`;
      setAlert({ show: true, message: errorMessage, type: "error" });
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
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
      >
        登录
      </button>
      <p
        className="text-center text-sm mt-4 text-blue-500 cursor-pointer hover:underline"
        onClick={toggleToRegister}
      >
        没有账号？去注册
      </p>
    </form>
  );
};

;
