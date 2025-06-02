import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'create'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
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
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return ShieldCheckIcon;
      case 'editor':
        return PencilSquareIcon;
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

  const handleUserAction = (user, action) => {
    setSelectedUser(user);
    setModalType(action);
    setShowModal(true);
  };

  const UserModal = () => {
    if (!selectedUser) return null;

    return (
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-gray-200">
                    <img 
                      src={selectedUser.avatar} 
                      alt={selectedUser.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {selectedUser.username}
                    </h3>
                    <p className="text-gray-500 text-sm">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-500">用户角色</span>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role === 'admin' ? '管理员' : 
                       selectedUser.role === 'editor' ? '编辑者' : '普通用户'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-500">账户状态</span>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status === 'active' ? '活跃' : '不活跃'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-500">注册时间</span>
                    <span className="text-sm text-gray-700">
                      {formatDate(selectedUser.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-500">最后登录</span>
                    <span className="text-sm text-gray-700">
                      {formatDate(selectedUser.lastLogin)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-500">登录次数</span>
                    <span className="text-lg font-medium text-gray-700">
                      {selectedUser.loginCount} 次
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-500">发布文章</span>
                    <span className="text-lg font-medium text-gray-700">
                      {selectedUser.articlesPublished} 篇
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    className="inline-flex items-center justify-center rounded-xl bg-gray-100 hover:bg-indigo-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors flex-1 gap-2"
                    onClick={() => {
                      setModalType('edit');
                    }}
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    编辑用户
                  </button>
                  <button 
                    className="inline-flex items-center justify-center rounded-xl bg-red-100 hover:bg-red-200 px-4 py-3 text-sm font-medium text-red-700 transition-colors flex-1 gap-2"
                    onClick={() => {
                      if (confirm('确定要删除这个用户吗？')) {
                        console.log('删除用户:', selectedUser.id);
                        setShowModal(false);
                      }
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                    删除用户
                  </button>
                </div>

                <button 
                  className="inline-flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 px-4 py-3 w-full mt-3 text-sm font-medium text-gray-700 transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
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
      className="space-y-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-700">
            用户管理
          </h1>
          <p className="text-gray-500">
            管理用户账户和权限设置
          </p>
        </div>
        <motion.button 
          className="inline-flex items-center justify-center rounded-xl bg-gray-100 hover:bg-indigo-100 px-6 py-3 text-sm font-medium text-gray-700 transition-colors gap-2 shadow-sm"
          onClick={() => handleUserAction(null, 'create')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusIcon className="h-5 w-5" />
          添加用户
        </motion.button>
      </motion.div>

      {/* Search and filter */}
      <motion.div 
        className="rounded-xl border border-gray-200 bg-white shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户名或邮箱..."
              className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-12 py-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select 
              className="flex h-11 items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">全部角色</option>
              <option value="admin">管理员</option>
              <option value="editor">编辑者</option>
              <option value="user">普通用户</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5" />
            <span>总用户: {users.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>活跃: {users.filter(u => u.status === 'active').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span>不活跃: {users.filter(u => u.status === 'inactive').length}</span>
          </div>
        </div>
      </motion.div>

      {/* User list */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {filteredUsers.map((user, index) => {
          const RoleIcon = getRoleIcon(user.role);
          
          return (
            <motion.div
              key={user.id}
              className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.2 + index * 0.05,
              }}
              whileHover={{ 
                y: -4,
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              onClick={() => handleUserAction(user, 'view')}
            >
              <div className="p-6">
                {/* User info */}
                <div className="flex items-start gap-4 mb-6">
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-gray-200 group-hover:ring-indigo-200 transition-all duration-300 shadow-sm">
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className={`
                      absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm
                      ${user.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}
                    `}></div>
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors truncate">
                      {user.username}
                    </h3>
                    <p className="text-sm text-gray-500 truncate flex items-center gap-1 mt-1">
                      <EnvelopeIcon className="h-4 w-4" />
                      {user.email}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(user.role)} gap-1`}>
                        <RoleIcon className="h-3 w-3" />
                        {user.role === 'admin' ? '管理员' : 
                         user.role === 'editor' ? '编辑者' : '普通用户'}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? '活跃' : '不活跃'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ClockIcon className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-500">登录次数</span>
                    </div>
                    <p className="text-lg font-medium text-gray-700">{user.loginCount}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ChartBarIcon className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-500">发布文章</span>
                    </div>
                    <p className="text-lg font-medium text-gray-700">{user.articlesPublished}</p>
                  </div>
                </div>

                {/* Time info */}
                <div className="space-y-3 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4" />
                    <span>注册于 {formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    <span>最后登录 {formatDate(user.lastLogin)}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <motion.button 
                    className="inline-flex items-center justify-center rounded-xl bg-gray-100 hover:bg-indigo-100 px-4 py-2 flex-1 transition-colors gap-2 text-sm font-medium text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserAction(user, 'edit');
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    编辑
                  </motion.button>
                  <motion.button 
                    className="inline-flex items-center justify-center rounded-xl bg-red-100 hover:bg-red-200 px-4 py-2 transition-colors text-red-700 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('确定要删除这个用户吗？')) {
                        console.log('删除用户:', user.id);
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty state */}
      {filteredUsers.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <p className="text-lg font-medium text-gray-700 mb-3">
            {searchTerm || selectedRole !== 'all' ? '没有找到匹配的用户' : '还没有用户'}
          </p>
          <p className="text-gray-500 mb-8">
            {searchTerm || selectedRole !== 'all' ? '尝试调整搜索条件' : '开始添加第一个用户'}
          </p>
          {!searchTerm && selectedRole === 'all' && (
            <motion.button 
              className="inline-flex items-center justify-center rounded-xl bg-gray-100 hover:bg-indigo-100 px-6 py-3 text-sm font-medium text-gray-700 transition-colors gap-2 shadow-sm"
              onClick={() => handleUserAction(null, 'create')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlusIcon className="h-5 w-5" />
              添加用户
            </motion.button>
          )}
        </motion.div>
      )}

      {/* User modal */}
      <UserModal />
    </motion.div>
  );
} 