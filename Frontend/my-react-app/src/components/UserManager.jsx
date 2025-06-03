import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  UserIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  FunnelIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'
  const [isLoading, setIsLoading] = useState(true);

  // Breadcrumb data
  const breadcrumbs = [
    { name: '首页', href: '#' },
    { name: '用户管理', current: true }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role
  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      // 使用模拟数据
      setUsers([
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2024-03-20T15:45:00Z',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          loginCount: 156,
          articlesPublished: 23
        },
        {
          id: 2,
          username: 'editor1',
          email: 'editor@example.com',
          role: 'editor',
          status: 'active',
          createdAt: '2024-02-01T09:20:00Z',
          lastLogin: '2024-03-19T14:30:00Z',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor1',
          loginCount: 89,
          articlesPublished: 12
        },
        {
          id: 3,
          username: 'user123',
          email: 'user@example.com',
          role: 'user',
          status: 'inactive',
          createdAt: '2024-02-15T16:45:00Z',
          lastLogin: '2024-03-15T11:20:00Z',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user123',
          loginCount: 45,
          articlesPublished: 0
        }
      ]);
      setFilteredUsers([
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2024-03-20T15:45:00Z',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          loginCount: 156,
          articlesPublished: 23
        },
        {
          id: 2,
          username: 'editor1',
          email: 'editor@example.com',
          role: 'editor',
          status: 'active',
          createdAt: '2024-02-01T09:20:00Z',
          lastLogin: '2024-03-19T14:30:00Z',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor1',
          loginCount: 89,
          articlesPublished: 12
        },
        {
          id: 3,
          username: 'user123',
          email: 'user@example.com',
          role: 'user',
          status: 'inactive',
          createdAt: '2024-02-15T16:45:00Z',
          lastLogin: '2024-03-15T11:20:00Z',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user123',
          loginCount: 45,
          articlesPublished: 0
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('确定要删除这个用户吗？')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return ShieldCheckIcon;
      case 'editor':
        return PencilIcon;
      default:
        return UserIcon;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'editor':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '从未';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1天前';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}周前`;
    return date.toLocaleDateString('zh-CN');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">加载用户数据中...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Breadcrumb */}
      <motion.nav 
        className="flex" 
        aria-label="Breadcrumb"
        variants={item}
      >
        <ol className="flex items-center text-sm text-gray-500">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.name} className="flex items-center">
              {index > 0 && (
                <svg className="flex-shrink-0 h-4 w-4 text-gray-300 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {crumb.current ? (
                <span className="font-medium text-gray-900">{crumb.name}</span>
              ) : (
                <a href={crumb.href} className="hover:text-gray-700 transition-colors">
                  {crumb.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </motion.nav>

      {/* Page Header */}
      <motion.div 
        className="flex items-center justify-between"
        variants={item}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">用户管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            管理系统用户账户和权限设置
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCreateUser}
            className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <PlusIcon className="h-4 w-4" />
            新增用户
          </button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-md"
        variants={item}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索用户名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">角色:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">全部</option>
              <option value="admin">管理员</option>
              <option value="editor">编辑者</option>
              <option value="user">普通用户</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div 
        className="bg-white rounded-xl shadow-md overflow-hidden"
        variants={item}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">用户列表</h3>
            <span className="text-sm text-gray-500">共 {filteredUsers.length} 个用户</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">最后登录</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="h-10 w-10 rounded-lg object-cover ring-1 ring-gray-200"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role === 'admin' ? '管理员' : user.role === 'editor' ? '编辑者' : '普通用户'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? '活跃' : '非活跃'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="查看"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">没有找到用户</h3>
            <p className="text-sm text-gray-500">尝试调整搜索条件或创建新用户</p>
          </div>
        )}
      </motion.div>

      {/* User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'view' ? '查看用户' : modalMode === 'edit' ? '编辑用户' : '新增用户'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {selectedUser && modalMode === 'view' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedUser.avatar} 
                      alt={selectedUser.username}
                      className="h-16 w-16 rounded-xl object-cover ring-2 ring-gray-200"
                    />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{selectedUser.username}</h4>
                      <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">角色</p>
                      <p className="text-sm text-gray-900 mt-1">{selectedUser.role === 'admin' ? '管理员' : selectedUser.role === 'editor' ? '编辑者' : '普通用户'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">状态</p>
                      <p className="text-sm text-gray-900 mt-1">{selectedUser.status === 'active' ? '活跃' : '非活跃'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</p>
                      <p className="text-sm text-gray-900 mt-1">{selectedUser.createdAt}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">最后登录</p>
                      <p className="text-sm text-gray-900 mt-1">{selectedUser.lastLogin}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  关闭
                </button>
                {modalMode !== 'view' && (
                  <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2">
                    <CheckIcon className="h-4 w-4" />
                    {modalMode === 'edit' ? '保存' : '创建'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 