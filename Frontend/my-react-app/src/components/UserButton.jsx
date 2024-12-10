
import axiosInstance from "./Axios";
import { useNavigate } from "react-router-dom";
export default function UserButton(){
    const navigation = useNavigate();
    const handleLogout = async () => {
    try {
      // 调用后端的登出接口
      localStorage.removeItem("userToken");
      const response = await axiosInstance.post("/user/logout");
      if (response.status === 200) {
        // 处理成功登出的逻辑
        console.log("退出登录成功");
        // 清理本地存储的用户信息，例如清除 Token
        localStorage.removeItem("token");
        // 进行页面跳转或刷新
        // toggleToSwithLogoutButton();
        
        // navigation("/")
        window.location.reload();


      } else {
        console.error("退出登录失败", response.data);
      }
    } catch (error) {
      console.error("调用登出接口时出错", error);
    }
  };
    return(
        <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn bg-transparent w-24 h-12 text-slate-500 text-xl">User</div>
        <ul tabIndex={1} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li><a>个人中心</a></li>
            <li><a onClick={handleLogout} >退出登陆</a></li>
        </ul>
        </div>        
    )
}