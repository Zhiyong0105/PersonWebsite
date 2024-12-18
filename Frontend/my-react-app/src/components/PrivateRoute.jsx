import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const token = localStorage.getItem("token"); // 检查是否存在 Token
    return token ? children : <Navigate to="/" replace />; // 如果没有 Token，跳转到登录页面


}