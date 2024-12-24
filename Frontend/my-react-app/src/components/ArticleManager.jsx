import { useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

export default function ArticleManager() {
  const [selectedArticles, setSelectedArticles] = useState([]);
  
  // 模拟文章数据
  const articles = [
    {
      id: 1,
      title: "如何使用 React 构建现代化应用",
      status: "published",
      category: "技术",
      views: 1234,
      comments: 23,
      publishDate: "2024-03-15",
      lastModified: "2024-03-16"
    },
    // ... 更多文章
  ];

  return (
    <div className="h-full">
      <div className="bg-base-100 rounded-xl shadow-sm h-full flex flex-col">
        {/* 顶部操作栏 */}
        <div className="px-4 lg:px-6 py-4 border-b border-base-200/80 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-base-content">文章管理</h1>
              <p className="text-sm text-base-content/60 mt-1">管理和编辑您的所有文章</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-ghost btn-sm">
                批量删除
              </button>
              <button className="btn btn-primary btn-sm">
                新建文章
              </button>
            </div>
          </div>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="p-4 border-b border-base-200/80">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
                <input 
                  type="text"
                  placeholder="搜索文章..."
                  className="input input-bordered input-sm w-full pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="dropdown dropdown-end">
                <button className="btn btn-ghost btn-sm gap-2">
                  <FunnelIcon className="w-4 h-4" />
                  筛选
                </button>
                <div className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <div className="p-2">
                    <h3 className="font-medium mb-2">发布状态</h3>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="checkbox checkbox-sm" />
                        <span>已发布</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="checkbox checkbox-sm" />
                        <span>草稿</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="flex-1 overflow-auto">
          <table className="table table-zebra">
            <thead className="bg-base-200/50">
              <tr>
                <th className="w-[40px]">
                  <input type="checkbox" className="checkbox checkbox-sm" />
                </th>
                <th>文章标题</th>
                <th>状态</th>
                <th>分类</th>
                <th>浏览</th>
                <th>评论</th>
                <th>发布时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <input type="checkbox" className="checkbox checkbox-sm" />
                  </td>
                  <td>
                    <div className="font-medium">{article.title}</div>
                    <div className="text-xs text-base-content/60">
                      最后修改：{article.lastModified}
                    </div>
                  </td>
                  <td>
                    <div className="badge badge-success gap-1">
                      已发布
                    </div>
                  </td>
                  <td>{article.category}</td>
                  <td>{article.views}</td>
                  <td>{article.comments}</td>
                  <td>{article.publishDate}</td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <button className="btn btn-ghost btn-sm btn-square">
                        <EllipsisHorizontalIcon className="w-5 h-5" />
                      </button>
                      <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                        <li><a>编辑</a></li>
                        <li><a>预览</a></li>
                        <li><a className="text-error">删除</a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="p-4 border-t border-base-200/80">
          <div className="flex items-center justify-between">
            <div className="text-sm text-base-content/60">
              共 23 篇文章
            </div>
            <div className="join">
              <button className="join-item btn btn-sm">«</button>
              <button className="join-item btn btn-sm">1</button>
              <button className="join-item btn btn-sm btn-active">2</button>
              <button className="join-item btn btn-sm">3</button>
              <button className="join-item btn btn-sm">»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 