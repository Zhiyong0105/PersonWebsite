import { useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function UserManager() {
  const [selectedUsers, setSelectedUsers] = useState([]);

  // 模拟用户数据
  const users = [
    {
      id: 1,
      name: "张三",
      email: "zhangsan@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix1",
      role: "admin",
      status: "active",
      lastLogin: "2024-03-15 14:30",
      registerDate: "2024-01-01",
    },
    {
      id: 2,
      name: "李四",
      email: "lisi@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix2",
      role: "editor",
      status: "active",
      lastLogin: "2024-03-14 09:15",
      registerDate: "2024-01-15",
    },
    {
      id: 3,
      name: "王五",
      email: "wangwu@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix3",
      role: "user",
      status: "inactive",
      lastLogin: "2024-02-28 16:45",
      registerDate: "2024-02-01",
    },
  ];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'badge-primary';
      case 'editor': return 'badge-secondary';
      case 'user': return 'badge-ghost';
      default: return 'badge-ghost';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-warning';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="h-full">
      <div className="bg-base-100 rounded-xl shadow-sm h-full flex flex-col">
        {/* 顶部操作栏 */}
        <div className="px-4 lg:px-6 py-4 border-b border-base-200/80 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-base-content">用户管理</h1>
              <p className="text-sm text-base-content/60 mt-1">管理系统用户和权限</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-ghost btn-sm">
                导出数据
              </button>
              <button className="btn btn-primary btn-sm">
                添加用户
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
                  placeholder="搜索用户..."
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
                  <div className="p-2 space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">用户角色</h3>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="checkbox checkbox-sm" />
                          <span>管理员</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="checkbox checkbox-sm" />
                          <span>编辑者</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="checkbox checkbox-sm" />
                          <span>普通用户</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">账号状态</h3>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="checkbox checkbox-sm" />
                          <span>活跃</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="checkbox checkbox-sm" />
                          <span>未激活</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="flex-1 overflow-auto">
          <table className="table table-zebra">
            <thead className="bg-base-200/50">
              <tr>
                <th className="w-[40px]">
                  <input type="checkbox" className="checkbox checkbox-sm" />
                </th>
                <th>用户信息</th>
                <th>角色</th>
                <th>状态</th>
                <th>注册时间</th>
                <th>最后登录</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input type="checkbox" className="checkbox checkbox-sm" />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-8 h-8 rounded-full">
                          <img src={user.avatar} alt={user.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-base-content/60">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`badge ${getRoleBadgeColor(user.role)} badge-sm`}>
                      {user.role === 'admin' ? '管理员' : 
                       user.role === 'editor' ? '编辑者' : '用户'}
                    </div>
                  </td>
                  <td>
                    <div className={`badge ${getStatusBadgeColor(user.status)} badge-sm`}>
                      {user.status === 'active' ? '活跃' : '未激活'}
                    </div>
                  </td>
                  <td className="text-sm text-base-content/70">{user.registerDate}</td>
                  <td className="text-sm text-base-content/70">{user.lastLogin}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-ghost btn-xs">编辑</button>
                      <div className="dropdown dropdown-end">
                        <button className="btn btn-ghost btn-xs">更多</button>
                        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                          <li><a>重置密码</a></li>
                          <li><a>修改权限</a></li>
                          <li><a className="text-error">禁用账号</a></li>
                        </ul>
                      </div>
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
              共 24 位用户
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