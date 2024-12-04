import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function Header() {
  const [page, setPage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const currentPage = pathname.split("/").slice(0, 2).join("/");
      setPage(currentPage);
    }
  }, []);

  return (
    <header className="grid w-full grid-flow-col grid-cols-3 sm:grid-cols-4 bg-gray-100 shadow-lg">
      {/* 可以替换为 Avatar */}
      <div className="flex items-center px-4">
        <span className="text-lg font-bold">Logo</span>
      </div>
      {/* 导航栏 */}
      <Navbar page={page} />
    </header>
  );
}
