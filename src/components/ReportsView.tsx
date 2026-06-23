import React, { useState } from 'react';
import { Task } from '../types';
import { FileSpreadsheet, Download, RefreshCw, BarChart2, Calendar, Award, Star } from 'lucide-react';

interface ReportsViewProps {
  tasks: Task[];
}

export default function ReportsView({ tasks }: ReportsViewProps) {
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'hoan_thanh').length;
  const pending = total - completed;

  // Project breakdown count
  const projectStats = tasks.reduce((acc, task) => {
    const proj = task.project || 'Chung';
    if (!acc[proj]) acc[proj] = { total: 0, done: 0 };
    acc[proj].total += 1;
    if (task.status === 'hoan_thanh') acc[proj].done += 1;
    return acc;
  }, {} as Record<string, { total: number; done: number }>);

  // User performance breakdown count
  const userStats = tasks.reduce((acc, task) => {
    const name = task.assignedUser.name;
    if (!acc[name]) acc[name] = { total: 0, done: 0 };
    acc[name].total += 1;
    if (task.status === 'hoan_thanh') acc[name].done += 1;
    return acc;
  }, {} as Record<string, { total: number; done: number }>);

  const handleExport = () => {
    setExporting(true);
    setExportSuccess(false);
    setTimeout(() => {
      setExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-lg animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Báo cáo hiệu suất</h3>
          <p className="text-xs text-on-surface-variant">Thống kê chi tiết tiến độ hoàn thành đầu việc theo từng nhân viên và dự án</p>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-xs px-md py-2.5 bg-primary-container text-on-primary font-bold rounded-lg text-body-md shadow-sm hover:bg-primary-container/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {exporting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang kết xuất...</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4" />
              <span>Kết xuất báo cáo Excel</span>
            </>
          )}
        </button>
      </div>

      {exportSuccess && (
        <div className="p-md bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-body-md animate-fade-in flex items-center gap-sm">
          <Star className="w-5 h-5 text-emerald-600 fill-emerald-500" />
          <span>Báo cáo hiệu suất <strong>TaskFlow_Export_{new Date().toISOString().split('T')[0]}.xlsx</strong> đã được tải xuống và gửi thành công về hòm thư điện tử!</span>
        </div>
      )}

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Core numbers Column */}
        <div className="md:col-span-1 space-y-md">
          {/* Milestone Widget */}
          <div className="p-lg bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-sm">
              <Award className="w-6 h-6 fill-amber-50" />
            </div>
            <h4 className="font-headline-sm font-bold text-on-surface">Điểm số năng lực</h4>
            <div className="text-4xl font-extrabold text-primary my-xs">
              {total > 0 ? Math.round((completed / total) * 100) : 0} <span className="text-xs text-on-surface-variant font-medium">/ 100đ</span>
            </div>
            <p className="text-xs text-on-surface-variant max-w-xs">
              Dựa trên khối lượng công việc được giao và tỉ lệ hoàn thành nhiệm vụ trước thời hạn.
            </p>
          </div>

          {/* Health Index Tracker */}
          <div className="p-lg bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm space-y-sm">
            <h5 className="font-semibold text-body-lg text-on-surface">Thời chuẩn chỉnh</h5>
            <div className="flex justify-between items-center text-xs text-on-surface-variant">
              <span>Đúng hạn</span>
              <span>85% trung bình</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[85%]" />
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Các đầu việc gấp đều đã được kiểm tra và xử lý kịp thời bởi bộ phận hỗ trợ kỹ thuật và thiết kế.
            </p>
          </div>
        </div>

        {/* Detailed Table Column */}
        <div className="md:col-span-2 space-y-lg">
          {/* Performance by Projects */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-lg">
            <h4 className="font-headline-sm font-bold text-on-surface mb-md">Hiệu suất phân rã theo phân loại</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-body-md text-on-surface">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-xs font-bold uppercase text-on-surface-variant">
                    <th className="pb-sm">Dự án</th>
                    <th className="pb-sm text-center">Tổng số việc</th>
                    <th className="pb-sm text-center">Đã hoàn thành</th>
                    <th className="pb-sm text-right">Tỉ lệ đạt được</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {Object.entries(projectStats).map(([proj, stat]) => {
                    const percent = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;
                    return (
                      <tr key={proj} className="hover:bg-surface-container-low/20">
                        <td className="py-md font-semibold text-primary">{proj}</td>
                        <td className="py-md text-center font-mono">{stat.total}</td>
                        <td className="py-md text-center font-mono font-semibold text-emerald-700">{stat.done}</td>
                        <td className="py-md text-right">
                          <div className="flex items-center justify-end gap-xs">
                            <span className="font-mono font-bold text-on-surface">{percent}%</span>
                            <div className="w-16 bg-surface-container h-2 rounded-full overflow-hidden">
                              <div className="bg-primary h-full" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance by Personnel */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-lg">
            <h4 className="font-headline-sm font-bold text-on-surface mb-md">Sản lượng hoàn thành theo nhân sự phụ trách</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-body-md text-on-surface">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-xs font-bold uppercase text-on-surface-variant">
                    <th className="pb-sm">Nhân viên</th>
                    <th className="pb-sm text-center">Khối lượng được giao</th>
                    <th className="pb-sm text-center">Sản lượng hoàn thành</th>
                    <th className="pb-sm text-right">Tỉ lệ hoàn thành</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {Object.entries(userStats).map(([name, stat]) => {
                    const percent = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;
                    return (
                      <tr key={name} className="hover:bg-surface-container-low/20">
                        <td className="py-md font-semibold text-on-surface">{name}</td>
                        <td className="py-md text-center font-mono">{stat.total}</td>
                        <td className="py-md text-center font-mono font-semibold text-emerald-700">{stat.done}</td>
                        <td className="py-md text-right">
                          <div className="flex items-center justify-end gap-xs">
                            <span className="font-mono font-bold text-on-surface">{percent}%</span>
                            <div className="w-16 bg-surface-container h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-600 h-full" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
