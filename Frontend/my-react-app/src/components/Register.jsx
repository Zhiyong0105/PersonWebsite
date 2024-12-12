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
  <input type="password" className="grow"  placeholder="输入密码" />
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
  <input type="password" className="grow"  placeholder="再次输入密码" />
</label>
<label className="input input-bordered flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
    <path
      d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
  </svg>
  <input type="text" className="grow" placeholder="Email" />
</label>
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