import React from 'react';
import { Task } from '../types';
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Sparkles, Plus } from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  onAddTaskClick: () => void;
  onTabSwitch: (tab: 'lich_trinh') => void;
}

export default function DashboardView({ tasks, onAddTaskClick, onTabSwitch }: DashboardViewProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'hoan_thanh').length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Priority count
  const khancap = tasks.filter(t => t.priority === 'khan_cap' && t.status !== 'hoan_thanh').length;
  const cao = tasks.filter(t => t.priority === 'cao' && t.status !== 'hoan_thanh').length;
  const binhthuong = tasks.filter(t => t.priority === 'binh_thuong' && t.status !== 'hoan_thanh').length;

  // Tasks by projects count
  const projectsCount: Record<string, number> = {};
  tasks.forEach(t => {
    const proj = t.project || 'Khác';
    projectsCount[proj] = (projectsCount[proj] || 0) + 1;
  });

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-lg bg-gradient-to-r from-primary-container to-[#0c56d0] text-white rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div className="space-y-sm">
          <div className="flex items-center gap-xs text-indigo-200">
            <Sparkles className="w-5 h-5 fill-indigo-200" />
            <span className="text-xs font-bold uppercase tracking-wider">Thông tin tổng hợp</span>
          </div>
          <h2 className="font-headline-lg font-bold">Chào mừng trở lại với TaskFlow</h2>
          <p className="text-indigo-100 text-body-md max-w-lg">
            Hệ thống của bạn hiện hiển thị {completionRate}% hiệu quả hoàn thành mục tiêu. Hãy tiếp tục giải quyết các công việc còn tồn đọng hôm nay!
          </p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => onTabSwitch('lich_trinh')}
            className="px-md py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg text-body-md transition-all cursor-pointer"
          >
            Xem lịch trình
          </button>
          <button
            onClick={onAddTaskClick}
            className="px-md py-2.5 bg-white text-primary font-bold rounded-lg text-body-md shadow-sm hover:bg-indigo-50 transition-all flex items-center gap-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm việc mới</span>
          </button>
        </div>
      </div>

      {/* Bento-grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Total Tasks */}
        <div className="p-md bg-surface-container-lowest rounded-xl border border-outline-variant flex items-center justify-between shadow-sm">
          <div className="space-y-xs">
            <span className="text-label-md font-bold text-on-surface-variant uppercase">Tổng việc</span>
            <p className="text-3xl font-bold text-on-surface">{total}</p>
            <span className="text-xs text-on-surface-variant">Trong hệ thống dữ liệu</span>
          </div>
          <div className="p-sm bg-blue-50 text-blue-800 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Completed */}
        <div className="p-md bg-surface-container-lowest rounded-xl border border-outline-variant flex items-center justify-between shadow-sm">
          <div className="space-y-xs">
            <span className="text-label-md font-bold text-on-surface-variant uppercase">Đã hoàn thành</span>
            <p className="text-3xl font-bold text-emerald-700">{completed}</p>
            <span className="text-xs text-emerald-600 font-medium">+{completionRate}% Tiến độ</span>
          </div>
          <div className="p-sm bg-emerald-50 text-emerald-700 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Pending */}
        <div className="p-md bg-surface-container-lowest rounded-xl border border-outline-variant flex items-center justify-between shadow-sm">
          <div className="space-y-xs">
            <span className="text-label-md font-bold text-on-surface-variant uppercase">Đang chờ làm</span>
            <p className="text-3xl font-bold text-amber-700">{pending}</p>
            <span className="text-xs text-on-surface-variant">Chiếm {100 - completionRate}% số lượng</span>
          </div>
          <div className="p-sm bg-amber-50 text-amber-700 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* High priorities */}
        <div className="p-md bg-surface-container-lowest rounded-xl border border-outline-variant flex items-center justify-between shadow-sm">
          <div className="space-y-xs">
            <span className="text-label-md font-bold text-on-surface-variant uppercase">Khẩn cấp / Cao</span>
            <p className="text-3xl font-bold text-rose-700">{khancap + cao}</p>
            <span className="text-xs text-rose-600 font-medium">{khancap} khẩn cấp chưa xong</span>
          </div>
          <div className="p-sm bg-rose-50 text-rose-700 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts & Project Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Progress chart donut visualization */}
        <div className="lg:col-span-1 p-lg bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col items-center justify-center text-center">
          <h4 className="font-headline-sm font-bold text-on-surface self-start mb-md">Tỉ lệ hoàn thành</h4>
          
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-surface-container-high fill-none"
                strokeWidth="15"
              />
              <circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-primary fill-none transition-all duration-1000"
                strokeWidth="15"
                strokeDasharray={2 * Math.PI * 74}
                strokeDashoffset={2 * Math.PI * 74 * (1 - completionRate / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-on-surface">{completionRate}%</span>
              <span className="text-xs text-on-surface-variant uppercase font-bold tracking-widest mt-1">Đạt được</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-md w-full mt-lg pt-md border-t border-outline-variant">
            <div>
              <span className="text-xs text-on-surface-variant">Sắp xong</span>
              <p className="font-bold text-primary">{completed} đầu việc</p>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant">Hiệu suất chung</span>
              <p className="font-bold text-emerald-700">Tốt</p>
            </div>
          </div>
        </div>

        {/* Priority Level Breakdown lists details */}
        <div className="lg:col-span-2 p-lg bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-headline-sm font-semibold text-on-surface mb-xs">Mức độ ưu tiên của công việc chưa xong</h4>
            <p className="text-xs text-on-surface-variant mb-md">Ưu tiên các công việc đỏ để duy trì tiến trình công việc suôn sẻ</p>
          </div>

          <div className="space-y-md">
            {/* Khẩn cấp */}
            <div className="space-y-base">
              <div className="flex justify-between items-center text-body-md">
                <span className="font-medium text-rose-800 flex items-center gap-xs">
                  <span className="w-2.5 h-2.5 bg-rose-600 rounded-full"></span> Khẩn cấp
                </span>
                <span className="font-bold text-on-surface">{khancap} việc chưa hoàn thành</span>
              </div>
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-600 h-full"
                  style={{ width: `${total > 0 ? (khancap / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Cao */}
            <div className="space-y-base">
              <div className="flex justify-between items-center text-body-md">
                <span className="font-medium text-amber-800 flex items-center gap-xs">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> Ưu tiên cao
                </span>
                <span className="font-bold text-on-surface">{cao} việc chưa hoàn thành</span>
              </div>
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: `${total > 0 ? (cao / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Bình thường */}
            <div className="space-y-base">
              <div className="flex justify-between items-center text-body-md">
                <span className="font-medium text-teal-800 flex items-center gap-xs">
                  <span className="w-2.5 h-2.5 bg-teal-500 rounded-full"></span> Bình thường
                </span>
                <span className="font-bold text-on-surface">{binhthuong} việc chưa hoàn thành</span>
              </div>
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full"
                  style={{ width: `${total > 0 ? (binhthuong / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-md mt-md border-t border-outline-variant flex justify-between items-center">
            <span className="text-body-md text-on-surface-variant font-medium">
              Phân bổ nhân sự trên tổng việc: <strong className="text-primary">4 Chuyên viên</strong>
            </span>
            <button
              onClick={() => onTabSwitch('lich_trinh')}
              className="text-xs text-primary font-bold hover:underline cursor-pointer"
            >
              Xem chi tiết nhân sự →
            </button>
          </div>
        </div>
      </div>

      {/* Task projects distributions lists */}
      <div className="p-lg bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm text-left">
        <h4 className="font-headline-sm font-semibold text-on-surface mb-md">Phân bố công việc theo dự án</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-md">
          {Object.entries(projectsCount).map(([project, count]) => (
            <div key={project} className="p-sm bg-surface-container-low rounded-lg border border-outline-variant/30 hover:border-primary-container/40 transition-all text-center">
              <span className="text-xs font-bold uppercase text-on-surface-variant block truncate">{project}</span>
              <p className="text-2xl font-bold text-primary mt-xs">{count}</p>
              <span className="text-[10px] text-on-surface-variant block mt-0.5">nhiệm vụ liên quan</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
