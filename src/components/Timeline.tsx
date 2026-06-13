import { FileText, ClipboardCheck, MessageSquare, Phone, Activity, Plus } from 'lucide-react';
import type { Timeline as TimelineType } from '@/types';
import { formatDateTime } from '@/utils';
import { cn } from '@/lib/utils';

interface TimelineProps {
  events: TimelineType[];
}

const getIcon = (type: string) => {
  switch (type) {
    case 'create':
      return <Plus className="w-4 h-4" />;
    case 'evaluate':
      return <ClipboardCheck className="w-4 h-4" />;
    case 'rd-reply':
      return <MessageSquare className="w-4 h-4" />;
    case 'followup':
      return <Phone className="w-4 h-4" />;
    case 'status-change':
      return <Activity className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getIconBg = (type: string) => {
  switch (type) {
    case 'create':
      return 'bg-blue-500';
    case 'evaluate':
      return 'bg-purple-500';
    case 'rd-reply':
      return 'bg-indigo-500';
    case 'followup':
      return 'bg-green-500';
    case 'status-change':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
};

export default function TimelineView({ events }: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>暂无处理记录</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {events.map((event, index) => (
        <div key={event.id} className="relative pl-8 pb-6 last:pb-0">
          {index < events.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-200" />
          )}
          <div
            className={cn(
              'absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center text-white',
              getIconBg(event.type)
            )}
          >
            {getIcon(event.type)}
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-800">{event.operator}</span>
              <span className="text-xs text-slate-500">{formatDateTime(event.time)}</span>
            </div>
            <p className="text-slate-600 text-sm">{event.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
