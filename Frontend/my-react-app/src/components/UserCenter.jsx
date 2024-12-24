import { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  KeyIcon, 
  BellIcon, 
  ShieldCheckIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

export default function UserCenter() {
  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    setUserInfo(storedUserInfo);
  }, []);

  // 最近登录记录模拟数据
  const loginHistory = [
    { time: '2024-03-20 14:30:00', ip: '192.168.1.1', location: '北京', device: 'Chrome浏览器' },
    { time: '2024-03-19 09:15:00', ip: '192.168.1.2', location: '上海', device: 'Firefox浏览器' },
    { time: '2024-03-18 18:45:00', ip: '192.168.1.3', location: '广州', device: 'Safari浏览器' },
  ];

  const tabs = [
    { id: 'profile', name: '个人资料', icon: UserCircleIcon },
    { id: 'security', name: '安全设置', icon: ShieldCheckIcon },
    { id: 'notification', name: '消息通知', icon: BellIcon },
    { id: 'loginHistory', name: '登录记录', icon: ClockIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* 个人资料卡片 */}
            <div className="bg-base-200/50 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="avatar">
                  <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{userInfo.username || '用户名'}</h2>
                  <p className="text-base-content/60">{userInfo.email || 'user@example.com'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">用户名</span>
                  </label>
                  <input type="text" className="input input-bordered" value={userInfo.username || ''} readOnly />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">邮箱</span>
                  </label>
                  <input type="email" className="input input-bordered" value={userInfo.email || ''} readOnly />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">角色</span>
                  </label>
                  <input type="text" className="input input-bordered" value={userInfo.role === 'admin' ? '管理员' : '普通用户'} readOnly />
                </div>

                <button className="btn btn-primary mt-4">编辑资料</button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-base-200/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">账号安全</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                  <div className="flex items-center gap-3">
                    <KeyIcon className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-medium">登录密码</h3>
                      <p className="text-sm text-base-content/60">定期修改密码可以保护账号安全</p>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm">修改</button>
                </div>

                <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BellIcon className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-medium">安全提醒</h3>
                      <p className="text-sm text-base-content/60">开启登录通知，及时了解账号动态</p>
                    </div>
                  </div>
                  <input type="checkbox" className="toggle toggle-primary" checked />
                </div>
              </div>
            </div>
          </div>
        );

      case 'notification':
        return (
          <div className="space-y-6">
            <div className="bg-base-200/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">消息通知</h2>
              <div className="space-y-4">
                {['系统通知', '评论提醒', '私信提醒'].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                    <div>
                      <h3 className="font-medium">{item}</h3>
                      <p className="text-sm text-base-content/60">接收{item}的邮件提醒</p>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'loginHistory':
        return (
          <div className="space-y-6">
            <div className="bg-base-200/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">最近登录记录</h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>登录时间</th>
                      <th>IP地址</th>
                      <th>登录地点</th>
                      <th>设备信息</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginHistory.map((record, index) => (
                      <tr key={index}>
                        <td>{record.time}</td>
                        <td>{record.ip}</td>
                        <td>{record.location}</td>
                        <td>{record.device}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
      <div className="bg-base-100 rounded-xl shadow-sm h-full flex flex-col">
        <div className="px-4 lg:px-6 py-4 border-b border-base-200/80">
          <h1 className="text-xl font-bold text-base-content">用户中心</h1>
          <p className="text-sm text-base-content/60 mt-1">管理您的个人信息和账号安全</p>
        </div>

        <div className="flex-1 flex lg:flex-row flex-col">
          {/* 侧边标签栏 */}
          <div className="lg:w-48 lg:border-r border-base-200/80 p-4">
            <div className="flex lg:flex-col flex-row lg:space-y-2 gap-2 overflow-x-auto lg:overflow-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg w-full
                    transition-colors duration-200
                    ${activeTab === tab.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-base-200/50'
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