import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircleIcon, 
  KeyIcon, 
  BellIcon, 
  ShieldCheckIcon,
  ClockIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CameraIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { userAPI } from './api/user/user';

export default function UserCenter() {
  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    setUserInfo(storedUserInfo);
    setEditedInfo(storedUserInfo);
  }, []);

  // Breadcrumb data
  const breadcrumbs = [
    { name: '首页', href: '#' },
    { name: '用户中心', current: true }
  ];

  // 最近登录记录模拟数据
  const loginHistory = [
    { time: '2024-03-20 14:30:00', ip: '192.168.1.1', location: '北京', device: 'Chrome浏览器', status: 'success' },
    { time: '2024-03-19 09:15:00', ip: '192.168.1.2', location: '上海', device: 'Firefox浏览器', status: 'success' },
    { time: '2024-03-18 18:45:00', ip: '192.168.1.3', location: '广州', device: 'Safari浏览器', status: 'warning' },
  ];

  const tabs = [
    { id: 'profile', name: '个人资料', icon: UserCircleIcon },
    { id: 'security', name: '安全设置', icon: ShieldCheckIcon },
    { id: 'notification', name: '消息通知', icon: BellIcon },
    { id: 'loginHistory', name: '登录记录', icon: ClockIcon },
  ];

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const userInfo = await userAPI.getUserInfo();
      setUserInfo(userInfo);
      setEditedInfo(userInfo);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  // 更新用户信息
  const updateProfile = async () => {
    try {
      // await userAPI.updateUserInfo(editedInfo);
      // 模拟更新成功
      setUserInfo(editedInfo);
      localStorage.setItem('userInfo', JSON.stringify(editedInfo));
      setIsEditing(false);
      // 显示成功提示
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const cancelEdit = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div 
            className="space-y-6"
            variants={item}
            initial="hidden"
            animate="show"
          >
            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 relative">
                <div className="absolute -bottom-16 left-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-xl ring-4 ring-white bg-white overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.username || 'User'}`} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors">
                      <CameraIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="pt-20 pb-6 px-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{userInfo.username || '用户名'}</h2>
                    <p className="text-gray-500 mt-1">{userInfo.email || 'user@example.com'}</p>
                    <div className="mt-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {userInfo.role === 'admin' ? '管理员' : '普通用户'}
                      </span>
                    </div>
                  </div>
                  
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      编辑资料
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={cancelEdit}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        取消
                      </button>
                      <button 
                        onClick={updateProfile}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 text-sm font-medium"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        保存
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="username"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                          value={editedInfo.username || ''} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="bg-gray-50 p-3 rounded-lg text-gray-900 text-sm">
                          {userInfo.username || '未设置'}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                      {isEditing ? (
                        <input 
                          type="email" 
                          name="email"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                          value={editedInfo.email || ''} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="bg-gray-50 p-3 rounded-lg text-gray-900 text-sm">
                          {userInfo.email || '未设置'}
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
                      {isEditing ? (
                        <textarea 
                          name="bio"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24" 
                          value={editedInfo.bio || ''} 
                          onChange={handleInputChange}
                          placeholder="介绍一下自己吧..."
                        />
                      ) : (
                        <div className="bg-gray-50 p-3 rounded-lg text-gray-900 text-sm min-h-[60px]">
                          {userInfo.bio || '这个人很懒，什么都没有留下...'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div 
            className="space-y-6"
            variants={item}
            initial="hidden"
            animate="show"
          >
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">账号安全</h2>
                <p className="text-gray-500 mt-1 text-sm">管理您的账号安全设置</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <KeyIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">登录密码</h3>
                      <p className="text-sm text-gray-500">定期修改密码可以保护账号安全</p>
                    </div>
                  </div>
                  <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                    修改
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <BellIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">安全提醒</h3>
                      <p className="text-sm text-gray-500">开启登录通知，及时了解账号动态</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">两步验证</h3>
                      <p className="text-sm text-gray-500">使用手机验证码进行双重身份验证</p>
                    </div>
                  </div>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    设置
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'notification':
        return (
          <motion.div 
            className="space-y-6"
            variants={item}
            initial="hidden"
            animate="show"
          >
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">消息通知</h2>
                <p className="text-gray-500 mt-1 text-sm">管理您接收的通知类型</p>
              </div>
              
              <div className="p-6 space-y-4">
                {[
                  { name: '系统通知', desc: '接收系统更新和维护信息', icon: BellIcon, color: 'blue' },
                  { name: '评论提醒', desc: '当有人回复您的评论时通知您', icon: BellIcon, color: 'purple' },
                  { name: '私信提醒', desc: '当收到新私信时通知您', icon: BellIcon, color: 'green' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-${item.color}-100 flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">邮件</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'loginHistory':
        return (
          <motion.div 
            className="space-y-6"
            variants={item}
            initial="hidden"
            animate="show"
          >
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">登录记录</h2>
                <p className="text-gray-500 mt-1 text-sm">查看您的账号登录历史</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">登录时间</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">IP地址</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">登录地点</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">设备信息</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loginHistory.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.ip}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.device}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.status === 'success' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              成功
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                              异常
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

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
          <h1 className="text-2xl font-semibold text-gray-900">用户中心</h1>
          <p className="text-sm text-gray-500 mt-1">管理您的个人信息和账号安全</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        variants={item}
      >
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="space-y-1">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-indigo-50 text-indigo-600 font-medium' 
                      : 'hover:bg-gray-50 text-gray-700'
                    }
                  `}
                  whileHover={{ x: activeTab === tab.id ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
} 