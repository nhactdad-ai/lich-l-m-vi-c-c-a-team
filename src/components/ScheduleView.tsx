import React, { useState } from 'react';
import { Task, Priority, Status, SortField, SortOrder } from '../types';
import { Search, Filter, ArrowUpDown, CheckCircle, Circle, Folder, Calendar, Edit2, AlertCircle, Plus } from 'lucide-react';

interface ScheduleViewProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onEditTask: (task: Task) => void;
  onAddTaskClick: () => void;
}

export default function ScheduleView({ tasks, onToggleStatus, onEditTask, onAddTaskClick }: ScheduleViewProps) {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string | 'all'>('all');
  
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const [sortField, setSortField] = useState<SortField>('stt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Unique projects from the tasks
  const availableProjects = Array.from(new Set(tasks.map(t => t.project).filter(Boolean))) as string[];

  // 1. Filtering
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesProject = projectFilter === 'all' || task.project === projectFilter;

    return matchesSearch && matchesPriority && matchesStatus && matchesProject;
  });

  // 2. Sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'stt') {
      comparison = a.stt.localeCompare(b.stt);
    } else if (sortField === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === 'priority') {
      const priorityWeight = { khan_cap: 3, cao: 2, binh_thuong: 1 };
      comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
    } else if (sortField === 'status') {
      comparison = a.status.localeCompare(b.status);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Statistics
  const totalTasksCount = tasks.length;
  const pendingTasksCount = tasks.filter(t => t.status === 'dang_cho').length;

  const getPriorityBadgeAndDot = (task: Task) => {
    if (task.status === 'hoan_thanh') {
      return (
        <span className="inline-flex items-center px-sm py-1 rounded-full bg-surface-container-highest text-on-secondary-variant text-[12px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span> Hoàn thành
        </span>
      );
    }

    switch (task.priority) {
      case 'khan_cap':
        return (
          <span className="inline-flex items-center px-sm py-1 rounded-full bg-rose-100 text-rose-800 text-[12px] font-semibold border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-2 animate-pulse"></span> Khẩn cấp
          </span>
        );
      case 'cao':
        return (
          <span className="inline-flex items-center px-sm py-1 rounded-full bg-error-container text-on-error-container text-[12px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-error mr-2"></span> Ưu tiên cao
          </span>
        );
      case 'binh_thuong':
      default:
        return (
          <span className="inline-flex items-center px-sm py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-[12px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></span> Bình thường
          </span>
        );
    }
  };

  return (
    <div className="space-y-md">
      {/* Title block & Search Bar */}
      <div className="flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-md">
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Danh sách công việc</h3>
          <div className="flex gap-xs">
            <span className="px-sm py-1 bg-primary text-white text-[12px] font-bold rounded-md">
              {totalTasksCount} Tổng cộng
            </span>
            <span className="px-sm py-1 bg-surface-container-highest text-on-surface-variant text-[12px] font-bold rounded-md">
              {pendingTasksCount} Đang chờ
            </span>
          </div>
        </div>

        {/* Filters and sort anchors */}
        <div className="flex gap-sm self-end md:self-auto flex-wrap justify-end">
          {/* Quick Search */}
          <div className="relative w-48 md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm công việc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-xs py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant/50" />
          </div>

          <button
            onClick={() => {
              setShowFilters(!showFilters);
              setShowSortOptions(false);
            }}
            className={`flex items-center gap-xs px-md py-2 border rounded-lg transition-all text-body-md font-semibold cursor-pointer ${
              showFilters || priorityFilter !== 'all' || statusFilter !== 'all' || projectFilter !== 'all'
                ? 'bg-primary-container text-on-primary border-primary-container'
                : 'bg-surface-container-low border-outline-variant hover:bg-surface-container'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </button>

          <button
            onClick={() => {
              setShowSortOptions(!showSortOptions);
              setShowFilters(false);
            }}
            className={`flex items-center gap-xs px-md py-2 border rounded-lg transition-all text-body-md font-semibold cursor-pointer ${
              showSortOptions || sortField !== 'stt'
                ? 'bg-primary text-white border-primary'
                : 'bg-surface-container-low border-outline-variant hover:bg-surface-container'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Sắp xếp</span>
          </button>

          <button
            onClick={onAddTaskClick}
            className="flex items-center gap-xs px-md py-2 bg-[#0052cc] hover:bg-[#003d9b] text-white rounded-lg transition-all text-body-md font-extrabold cursor-pointer shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm công việc</span>
          </button>
        </div>
      </div>

      {/* Dynamic Filters Section */}
      {showFilters && (
        <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant grid grid-cols-1 md:grid-cols-3 gap-md animate-fade-in">
          {/* Status Filter */}
          <div className="flex flex-col gap-xs">
            <span className="text-xs font-bold uppercase text-on-surface-variant">Trạng thái</span>
            <div className="flex gap-xs flex-wrap">
              {([
                { val: 'all', label: 'Tất cả' },
                { val: 'dang_cho', label: 'Đang chờ' },
                { val: 'hoan_thanh', label: 'Hoàn thành' }
              ] as const).map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setStatusFilter(opt.val)}
                  className={`px-sm py-1 rounded-full text-xs font-semibold cursor-pointer border ${
                    statusFilter === opt.val
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-container-lowest text-on-surface border-outline-variant'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col gap-xs">
            <span className="text-xs font-bold uppercase text-on-surface-variant">Mức độ ưu tiên</span>
            <div className="flex gap-xs flex-wrap">
              {([
                { val: 'all', label: 'Tất cả' },
                { val: 'binh_thuong', label: 'Bình thường' },
                { val: 'cao', label: 'Ưu tiên cao' },
                { val: 'khan_cap', label: 'Khẩn cấp' }
              ] as const).map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setPriorityFilter(opt.val)}
                  className={`px-sm py-1 rounded-full text-xs font-semibold cursor-pointer border ${
                    priorityFilter === opt.val
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-container-lowest text-on-surface border-outline-variant'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Filter */}
          <div className="flex flex-col gap-xs">
            <span className="text-xs font-bold uppercase text-on-surface-variant">Dự án</span>
            <div className="flex gap-xs flex-wrap">
              {['all', ...availableProjects].map(proj => (
                <button
                  key={proj}
                  onClick={() => setProjectFilter(proj)}
                  className={`px-sm py-1 rounded-full text-xs font-semibold cursor-pointer border ${
                    projectFilter === proj
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-container-lowest text-on-surface border-outline-variant'
                  }`}
                >
                  {proj === 'all' ? 'Tất cả' : proj}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Sort Options Section */}
      {showSortOptions && (
        <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-md animate-fade-in">
          <div className="flex flex-wrap gap-xs items-center">
            <span className="text-xs font-bold uppercase text-on-surface-variant mr-xs">Sắp xếp theo:</span>
            {([
              { field: 'stt', label: 'Số thứ tự' },
              { field: 'title', label: 'Tiêu đề' },
              { field: 'priority', label: 'Độ ưu tiên' },
              { field: 'status', label: 'Trạng thái' }
            ] as const).map(opt => (
              <button
                key={opt.field}
                onClick={() => setSortField(opt.field)}
                className={`px-md py-1 rounded-md text-xs font-semibold cursor-pointer border ${
                  sortField === opt.field
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-xs">
            <button
              onClick={() => setSortOrder('asc')}
              className={`px-sm py-1 rounded-md text-xs font-semibold cursor-pointer border ${
                sortOrder === 'asc' ? 'bg-indigo-100 text-indigo-900 border-indigo-300' : 'bg-surface-container-lowest border-outline-variant'
              }`}
            >
              Tăng dần ↑
            </button>
            <button
              onClick={() => setSortOrder('desc')}
              className={`px-sm py-1 rounded-md text-xs font-semibold cursor-pointer border ${
                sortOrder === 'desc' ? 'bg-indigo-100 text-indigo-900 border-indigo-300' : 'bg-surface-container-lowest border-outline-variant'
              }`}
            >
              Giảm dần ↓
            </button>
          </div>
        </div>
      )}

      {/* Task Table Container */}
      {sortedTasks.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm transition-all duration-300">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f1f3ff] border-b border-outline-variant">
                <tr>
                  <th className="px-md py-sm md:px-lg md:py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider w-20">STT</th>
                  <th className="px-md py-sm md:px-lg md:py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Đầu việc</th>
                  <th className="px-md py-sm md:px-lg md:py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider w-44">Mức độ</th>
                  <th className="px-md py-sm md:px-lg md:py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider w-48">Người làm</th>
                  <th className="px-md py-sm md:px-lg md:py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center w-28">Xong</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {sortedTasks.map((task) => {
                  const isCompleted = task.status === 'hoan_thanh';
                  return (
                    <tr
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className="group hover:bg-surface-container-low/30 cursor-pointer transition-colors"
                    >
                      {/* Column STT */}
                      <td className="px-md py-sm md:px-lg md:py-lg font-mono text-body-md text-on-surface-variant">
                        {task.stt}
                      </td>

                      {/* Column Detail */}
                      <td className="px-md py-sm md:px-lg md:py-lg">
                        <div className="flex flex-col max-w-md">
                          <span
                            className={`font-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors ${
                              isCompleted ? 'line-through opacity-50' : ''
                            }`}
                          >
                            {task.title}
                          </span>
                          <span className="text-xs text-on-surface-variant mt-0.5 line-clamp-1 block">
                            {task.description}
                          </span>

                          <div className="flex items-center gap-md mt-2">
                            {task.project && (
                              <span className="inline-flex items-center gap-xs text-[11px] text-primary/75 bg-primary/5 px-2 py-0.5 rounded-md font-medium">
                                <Folder className="w-3 h-3" />
                                {task.project}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className="inline-flex items-center gap-xs text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Column Priority Badge */}
                      <td className="px-md py-sm md:px-lg md:py-lg">
                        {getPriorityBadgeAndDot(task)}
                      </td>

                      {/* Column Assignee avatar */}
                      <td className="px-md py-sm md:px-lg md:py-lg font-body-md text-on-surface">
                        <div className="flex items-center gap-sm">
                          {task.assignedUser.avatarUrl ? (
                            <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden flex-shrink-0">
                              <img
                                className="w-full h-full object-cover"
                                alt={task.assignedUser.name}
                                src={task.assignedUser.avatarUrl}
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[10px] font-bold">
                              AN
                            </div>
                          )}
                          <span className="font-body-md text-on-surface truncate max-w-28">
                            {task.assignedUser.name}
                          </span>
                        </div>
                      </td>

                      {/* Column Done Switch */}
                      <td className="px-md py-sm md:px-lg md:py-lg text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onToggleStatus(task.id)}
                          className="w-10 h-10 mx-auto flex items-center justify-center rounded-full hover:bg-primary-container/10 transition-colors cursor-pointer"
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-7 h-7 text-primary fill-primary" />
                          ) : (
                            <Circle className="w-7 h-7 text-outline-variant hover:text-primary transition-all-custom" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 flex flex-col items-center select-none animate-fade-in bg-surface-container-lowest rounded-xl border border-outline-variant">
          <div className="p-lg bg-surface-container-low rounded-full text-on-surface-variant/40 mb-md">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <p className="font-headline-sm text-on-surface font-bold">Không tìm thấy công việc nào!</p>
          <p className="font-body-md text-on-surface-variant text-center max-w-sm mt-xs">
            {search || priorityFilter !== 'all' || statusFilter !== 'all' || projectFilter !== 'all'
              ? 'Hãy điều chỉnh bộ lọc tìm kiếm của bạn để có thể hiển thị thêm kết quả.'
              : 'Hãy nhấp vào biểu tượng dấu cộng ở góc dưới màn hình để bắt đầu tạo kế hoạch.'}
          </p>
        </div>
      )}
    </div>
  );
}
