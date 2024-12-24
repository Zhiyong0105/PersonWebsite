import { useState } from "react";
import {
  ChartBarIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  // 模拟统计数据
  const stats = [
    {
      title: "总文章数",
      value: "138",
      change: "+12.5%",
      trend: "up",
      icon: DocumentTextIcon,
    },
    {
      title: "总浏览量",
      value: "8,821",
      change: "+23.1%",
      trend: "up",
      icon: EyeIcon,
    },
    {
      title: "总评论数",
      value: "1,232",
      change: "-5.4%",
      trend: "down",
      icon: ChatBubbleLeftIcon,
    },
  ];

  // 模拟最近文章数据
  const recentArticles = [
    {
      id: 1,
      title: "如何使用 React 构建现代化应用",
      views: 1234,
      comments: 23,
      publishDate: "2024-03-15",
    },
    {
      id: 2,
      title: "TypeScript 高级特性详解",
      views: 892,
      comments: 15,
      publishDate: "2024-03-14",
    },
    {
      id: 3,
      title: "Next.js 13 新特性解析",
      views: 756,
      comments: 18,
      publishDate: "2024-03-13",
    },
  ];

  return (
    <div className="h-full min-h-[calc(100vh-2rem)]">
      <div className="bg-base-100 rounded-xl shadow-sm h-full flex flex-col">
        {/* 顶部标题 */}
        <div className="px-4 lg:px-6 py-4 border-b border-base-200/80">
          <h1 className="text-xl font-bold text-base-content">仪表盘</h1>
          <p className="text-sm text-base-content/60 mt-1">查看您的博客数据概览</p>
        </div>

        <div className="p-4 lg:p-6 space-y-6 flex-1 overflow-auto">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-base-200/50 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base-content/60 text-sm">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${
                      stat.trend === 'up' ? 'text-success' : 'text-error'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-4 h-4" />
                      )}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className="bg-base-content/5 p-3 rounded-lg">
                    <stat.icon className="w-6 h-6 text-base-content/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* 访问趋势图 */}
            <div className="bg-base-200/50 rounded-xl p-4 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium">访问趋势</h3>
                <select className="select select-bordered select-sm">
                  <option>最近7天</option>
                  <option>最近30天</option>
                </select>
              </div>
              <div className="h-[300px] flex items-center justify-center text-base-content/40">
                此处放置访问趋势图表
              </div>
            </div>

            {/* 文章分类统计 */}
            <div className="bg-base-200/50 rounded-xl p-4 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium">文章分类</h3>
                <button className="btn btn-ghost btn-sm">
                  查看全部
                </button>
              </div>
              <div className="h-[300px] flex items-center justify-center text-base-content/40">
                此处放置文章分类饼图
              </div>
            </div>
          </div>

          {/* 最近文章 */}
          <div className="bg-base-200/50 rounded-xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium">最近文章</h3>
              <button className="btn btn-ghost btn-sm">
                查看全部
              </button>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[600px] lg:w-full">
                <table className="table">
                  <thead>
                    <tr>
                      <th>文章标题</th>
                      <th>发布时间</th>
                      <th>浏览量</th>
                      <th>评论数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentArticles.map((article) => (
                      <tr key={article.id}>
                        <td className="font-medium">{article.title}</td>
                        <td className="text-base-content/60">{article.publishDate}</td>
                        <td>
                          <div className="flex items-center gap-1">
                            <EyeIcon className="w-4 h-4 text-base-content/40" />
                            {article.views}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <ChatBubbleLeftIcon className="w-4 h-4 text-base-content/40" />
                            {article.comments}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 