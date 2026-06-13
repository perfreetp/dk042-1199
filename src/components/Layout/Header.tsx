import { Bell, Search, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '@/store/useStore';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setFilters } = useStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/requirements') {
      navigate('/requirements');
    }
    setFilters({ keyword: searchQuery });
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return '汇总仪表盘';
      case '/requirements':
        return '客户需求台账';
      default:
        if (location.pathname.startsWith('/requirements/')) {
          return '需求详情';
        }
        return '售后需求管理系统';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索需求编号、标题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </form>

        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-700">管理员</p>
            <p className="text-xs text-slate-500">系统管理员</p>
          </div>
        </div>
      </div>
    </header>
  );
}
