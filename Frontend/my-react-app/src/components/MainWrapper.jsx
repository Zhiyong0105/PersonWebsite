import { useLocation} from "react-router-dom"

export default function MainWrapper({ children }) {
    const location = useLocation();
    const pathname = location.pathname; // 获取路径名
    const page = pathname.split("/").slice(0, 2).join("/") || "/";

    return (
        <main 
            className={`duration-1000 w-full  ${page == "/" ? "translate-y-20 mt-20 mb-20" : "mt-16"} min-h-[calc(100svh-350px)]`}
        >
            {children}
        </main>
    )

}