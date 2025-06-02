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
  FunnelIcon
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
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
        },
        {
          id: 2,
          username: 'editor1',
          email: 'editor@example.com',
          role: 'editor',
          status: 'active',
          createdAt: '2024-02-01T09:20:00Z',
          lastLogin: '2024-03-19T14:30:00Z',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor1'
        },
        {
          id: 3,
          username: 'user123',
          email: 'user@example.com',
          role: 'user',
          status: 'inactive',
          createdAt: '2024-02-15T16:45:00Z',
          lastLogin: '2024-03-15T11:20:00Z',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user123'
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
        return 'bg-red-100 text-red-700 border-red-200';
      case 'editor':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-yellow-100 text-yellow-700 border-yellow-200';
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-primary/10">
                    <img 
                      src={selectedUser.avatar} 
                      alt={selectedUser.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-base-content">
                      {selectedUser.username}
                    </h3>
                    <p className="text-base-content/60">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-base-50 rounded-xl">
                    <span className="text-sm font-medium text-base-content/70">用户角色</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role === 'admin' ? '管理员' : 
                       selectedUser.role === 'editor' ? '编辑者' : '普通用户'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-base-50 rounded-xl">
                    <span className="text-sm font-medium text-base-content/70">账户状态</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status === 'active' ? '活跃' : '不活跃'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-base-50 rounded-xl">
                    <span className="text-sm font-medium text-base-content/70">注册时间</span>
                    <span className="text-sm text-base-content">
                      {formatDate(selectedUser.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-base-50 rounded-xl">
                    <span className="text-sm font-medium text-base-content/70">最后登录</span>
                    <span className="text-sm text-base-content">
                      {formatDate(selectedUser.lastLogin)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    className="btn btn-primary flex-1"
                    onClick={() => {
                      setModalType('edit');
                    }}
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    编辑用户
                  </button>
                  <button 
                    className="btn btn-error flex-1"
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
                  className="btn btn-ghost w-full mt-3"
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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-base-content/60 font-medium">加载用户数据中...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
            用户管理
          </h1>
          <p className="text-base-content/60 mt-2 font-medium">
            管理用户账户和权限设置
          </p>
        </div>
        <button 
          className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-300 group"
          onClick={() => handleUserAction(null, 'create')}
        >
          <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          添加用户
        </button>
      </motion.div>

      {/* 搜索和筛选 */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-base-200/50 shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
            <input
              type="text"
              placeholder="搜索用户名或邮箱..."
              className="input input-bordered w-full pl-10 bg-white/80 border-base-200/50 focus:border-primary/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <FunnelIcon className="h-5 w-5 text-base-content/60" />
            <select 
              className="select select-bordered bg-white/80 border-base-200/50 focus:border-primary/50 transition-colors"
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
        
        <div className="flex items-center gap-6 mt-4 text-sm text-base-content/60">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-4 w-4" />
            <span>总用户: {users.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>活跃: {users.filter(u => u.status === 'active').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span>不活跃: {users.filter(u => u.status === 'inactive').length}</span>
          </div>
        </div>
      </motion.div>

      {/* 用户列表 */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filteredUsers.map((user, index) => {
          const RoleIcon = getRoleIcon(user.role);
          
          return (
            <motion.div
              key={user.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-base-200/50 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.2 + index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -4,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              onClick={() => handleUserAction(user, 'view')}
            >
              <div className="p-6">
                {/* 用户头像和基本信息 */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`
                      absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                      ${user.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}
                    `}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base-content group-hover:text-primary transition-colors duration-300 truncate">
                      {user.username}
                    </h3>
                    <p className="text-sm text-base-content/60 truncate flex items-center gap-1 mt-1">
                      <EnvelopeIcon className="h-3 w-3" />
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* 角色和状态标签 */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getRoleColor(user.role)} flex items-center gap-1`}>
                    <RoleIcon className="h-3 w-3" />
                    {user.role === 'admin' ? '管理员' : 
                     user.role === 'editor' ? '编辑者' : '普通用户'}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(user.status)}`}>
                    {user.status === 'active' ? '活跃' : '不活跃'}
                  </span>
                </div>

                {/* 时间信息 */}
                <div className="space-y-2 text-xs text-base-content/50">
                  <div className="flex items-center gap-1">
                    <CalendarDaysIcon className="h-3 w-3" />
                    <span>注册于 {formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 flex items-center justify-center">•</span>
                    <span>最后登录 {formatDate(user.lastLogin)}</span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="btn btn-ghost btn-sm flex-1 hover:bg-primary/10 hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserAction(user, 'edit');
                    }}
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    编辑
                  </button>
                  <button 
                    className="btn btn-ghost btn-sm hover:bg-error/10 hover:text-error"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('确定要删除这个用户吗？')) {
                        console.log('删除用户:', user.id);
                      }
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 空状态 */}
      {filteredUsers.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <UserGroupIcon className="h-20 w-20 text-base-content/20 mx-auto mb-4" />
          <p className="text-xl font-semibold text-base-content/60 mb-2">
            {searchTerm || selectedRole !== 'all' ? '没有找到匹配的用户' : '还没有用户'}
          </p>
          <p className="text-base-content/40 mb-6">
            {searchTerm || selectedRole !== 'all' ? '尝试调整搜索条件' : '开始添加第一个用户'}
          </p>
          {!searchTerm && selectedRole === 'all' && (
            <button 
              className="btn btn-primary"
              onClick={() => handleUserAction(null, 'create')}
            >
              <PlusIcon className="h-5 w-5" />
              添加用户
            </button>
          )}
        </motion.div>
      )}

      {/* 用户详情/编辑模态框 */}
      <UserModal />
    </div>
  );
} 