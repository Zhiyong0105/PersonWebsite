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
    <form className="w-4/5 flex flex-col gap-4" onSubmit={handleSubmit}>
 
<label className="input input-bordered flex items-center gap-4">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
  </svg>
  <input type="text" className="grow" placeholder="Username" />
</label>

<label className="input input-bordered flex items-center gap-4">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      fillRule="evenodd"
      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
      clipRule="evenodd" />
  </svg>
  <input type="password" className="grow"  placeholder="******" />
</label>
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
