import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { userAPI } from './api/user/user';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      let response;
      
      if (isSignUp) {
        // 检查密码确认
        const confirmPassword = event.target.confirmPassword.value;
        if (password !== confirmPassword) {
          setError("两次输入的密码不一致");
          return;
        }
        
        const email = event.target.email.value;
        // 注册新用户
        response = await userAPI.register({
          username,
          password,
          email
        });
      } else {
        // 登录已有用户
        response = await userAPI.login(username, password);
      }
      
      const { token, username: responseUsername, email } = response;
      
      // 保存用户信息
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify({
        username: responseUsername,
        role: 'admin',
        email
      }));
      
      // 更新父组件状态
      onLogin?.();
      window.location.reload();
      // 重定向
      navigate("/article");
      
    } catch (error) {
      setError(error.message || (isSignUp ? "注册失败，请重试" : "登录失败，请重试"));
    }
  };

  // 处理GitHub登录
  const handleGithubLogin = () => {
    // 设置登录来源标记
    sessionStorage.setItem('loginSource', 'github');
    // 重定向到后端的 OAuth2 登录端点
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';

  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-base-200 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {isSignUp ? "创建账号" : "欢迎回来"}
              </h2>
              <p className="text-base-content/60 text-sm">
                {isSignUp ? "开始你的创作之旅" : "很高兴再次见到你"}
              </p>
            </div>

            {/* 第三方登录按钮 */}
            <div className="space-y-3 mb-6">
              <button className="btn btn-outline w-full gap-2 hover:bg-base-200 hover:border-base-200">
                <FaGoogle className="w-5 h-5" />
                <span>使用 Google 账号{isSignUp ? "注册" : "登录"}</span>
              </button>
              <button 
                onClick={handleGithubLogin}
                className="btn btn-outline w-full gap-2 hover:bg-base-200 hover:border-base-200"
              >
                <FaGithub className="w-5 h-5" />
                <span>使用 GitHub 账号{isSignUp ? "注册" : "登录"}</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-base-100 text-base-content/60">
                  或使用邮箱{isSignUp ? "注册" : "登录"}
                </span>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="alert alert-error mb-4 py-2 text-sm">
                {error}
              </div>
            )}

            {/* 登录表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="用户名"
                  required
                  className="input input-bordered w-full bg-base-200 border-base-200 focus:border-primary"
                />
              </div>

              {isSignUp && (
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="邮箱地址"
                    required
                    className="input input-bordered w-full bg-base-200 border-base-200 focus:border-primary"
                  />
                </div>
              )}

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="密码"
                  required
                  className="input input-bordered w-full bg-base-200 border-base-200 focus:border-primary"
                />
              </div>

              {isSignUp && (
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="确认密码"
                    required
                    className="input input-bordered w-full bg-base-200 border-base-200 focus:border-primary"
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full">
                {isSignUp ? "注册" : "登录"}
              </button>
            </form>

            {/* <div className="mt-6 text-center text-sm">
              <span className="text-base-content/60">
                {isSignUp ? "已有账号?" : "还没有账号?"}
              </span>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-primary hover:underline font-medium"
              >
                {isSignUp ? "去登录" : "去注册"}
              </button>
            </div> */}

            <p className="mt-6 text-xs text-center text-base-content/60">
              继续即表示您同意我们的
              <a href="#" className="text-primary hover:underline">
                服务条款
              </a>
              和
              <a href="#" className="text-primary hover:underline">
                隐私政策
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 