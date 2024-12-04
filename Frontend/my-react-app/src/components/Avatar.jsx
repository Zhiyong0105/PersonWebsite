import { Link } from "react-router-dom";

export default function Avatar({ page }) {
  return (
    <div className="flex items-center justify-start col-span-1">
      <Link to="/">
        {/* 使用文字 Logo 替代图片 */}
        <div
          className={`flex items-center justify-center text-3xl font-bold opacity-60 hover:opacity-90 duration-1000 rounded-full ${
            page === "/" ? "translate-y-20 scale-150" : ""
          }`}
        >
          ZL
        </div>
      </Link>
    </div>
  );
}
