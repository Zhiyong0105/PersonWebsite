import { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  KeyIcon, 
  BellIcon, 
  ShieldCheckIcon,
  ClockIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* 个人资料卡片 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
                <div className="absolute -bottom-16 left-6">
                  <div className="avatar">
                    <div className="w-32 h-32 rounded-full ring-4 ring-white bg-white">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.username || 'User'}`} alt="avatar" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-20 pb-6 px-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{userInfo.username || '用户名'}</h2>
                    <p className="text-gray-500 mt-1">{userInfo.email || 'user@example.com'}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {userInfo.role === 'admin' ? '管理员' : '普通用户'}
                      </span>
                    </div>
                  </div>
                  
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="btn btn-sm btn-outline gap-2"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      编辑资料
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={cancelEdit}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        取消
                      </button>
                      <button 
                        onClick={updateProfile}
                        className="btn btn-sm btn-primary gap-1"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        保存
                      </button>
                    </div>
                  )}
                </div>

                <div className="divider my-4"></div>

                <div className="space-y-4 max-w-md">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">用户名</span>
                    </label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="username"
                        className="input input-bordered focus:input-primary" 
                        value={editedInfo.username || ''} 
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-lg text-gray-700">
                        {userInfo.username || '未设置'}
                      </div>
                    )}
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">邮箱</span>
                    </label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        name="email"
                        className="input input-bordered focus:input-primary" 
                        value={editedInfo.email || ''} 
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-lg text-gray-700">
                        {userInfo.email || '未设置'}
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">个人简介</span>
                    </label>
                    {isEditing ? (
                      <textarea 
                        name="bio"
                        className="textarea textarea-bordered focus:textarea-primary h-24" 
                        value={editedInfo.bio || ''} 
                        onChange={handleInputChange}
                        placeholder="介绍一下自己吧..."
                      />
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-lg text-gray-700 min-h-[60px]">
                        {userInfo.bio || '这个人很懒，什么都没有留下...'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">账号安全</h2>
                <p className="text-gray-500 mt-1">管理您的账号安全设置</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <KeyIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">登录密码</h3>
                      <p className="text-sm text-gray-500">定期修改密码可以保护账号安全</p>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-primary">修改</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <BellIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">安全提醒</h3>
                      <p className="text-sm text-gray-500">开启登录通知，及时了解账号动态</p>
                    </div>
                  </div>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">两步验证</h3>
                      <p className="text-sm text-gray-500">使用手机验证码进行双重身份验证</p>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-outline">设置</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notification':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">消息通知</h2>
                <p className="text-gray-500 mt-1">管理您接收的通知类型</p>
              </div>
              
              <div className="p-6 space-y-4">
                {[
                  { name: '系统通知', desc: '接收系统更新和维护信息', icon: BellIcon, color: 'blue' },
                  { name: '评论提醒', desc: '当有人回复您的评论时通知您', icon: BellIcon, color: 'purple' },
                  { name: '私信提醒', desc: '当收到新私信时通知您', icon: BellIcon, color: 'green' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-${item.color}-100 flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">邮件</span>
                      <input type="checkbox" className="toggle toggle-sm toggle-primary" defaultChecked />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'loginHistory':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">登录记录</h2>
                <p className="text-gray-500 mt-1">查看您的账号登录历史</p>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="rounded-l-lg">登录时间</th>
                        <th>IP地址</th>
                        <th>登录地点</th>
                        <th>设备信息</th>
                        <th className="rounded-r-lg">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginHistory.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="font-medium">{record.time}</td>
                          <td>{record.ip}</td>
                          <td>{record.location}</td>
                          <td>{record.device}</td>
                          <td>
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
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      <div className="bg-gray-50 rounded-xl shadow-sm h-full flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">用户中心</h1>
          <p className="text-sm text-gray-500 mt-1">管理您的个人信息和账号安全</p>
        </div>

        <div className="flex-1 flex lg:flex-row flex-col">
          {/* 侧边标签栏 */}
          <div className="lg:w-56 lg:border-r border-gray-200 p-4">
            <div className="flex lg:flex-col flex-row lg:space-y-2 gap-2 overflow-x-auto lg:overflow-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg w-full
                    transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-primary text-white font-medium shadow-sm' 
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="whitespace-nowrap">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="flex-1 p-4 lg:p-6 overflow-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 