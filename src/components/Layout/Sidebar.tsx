import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useStore from '@/store/useStore';

const menuItems = [
  { path: '/dashboard', label: '汇总仪表盘', icon: LayoutDashboard },
  { path: '/requirements', label: '客户需求台账', icon: FileText },
];

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-40',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold truncate">售后需求管理</h1>
              <p className="text-xs text-slate-400 truncate">医疗器械售后服务系统</p>
            </div>
          )}
        </div>
      </div>

      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-slate-800',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                )
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute bottom-4 right-0 translate-x-1/2 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
