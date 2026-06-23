import React, { useState } from 'react';
import { Task } from '../types';
import { FolderKanban, Check, ToggleLeft, ArrowRight, ClipboardList, CheckCircle } from 'lucide-react';

interface ProjectsViewProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export default function ProjectsView({ tasks, onToggleStatus, onEditTask }: ProjectsViewProps) {
  const [selectedProject, setSelectedProject] = useState<string>('Tất cả');

  // Find unique projects
  const uniqueProjects = ['Tất cả', ...Array.from(new Set(tasks.map(t => t.project).filter(Boolean)))] as string[];

  // Filter tasks based on selected project
  const projectTasks = selectedProject === 'Tất cả'
    ? tasks
    : tasks.filter(t => t.project === selectedProject);

  const pendingTasks = projectTasks.filter(t => t.status === 'dang_cho');
  const completedTasks = projectTasks.filter(t => t.status === 'hoan_thanh');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'khan_cap': return 'bg-rose-500';
      case 'cao': return 'bg-amber-500';
      case 'binh_thuong':
      default: return 'bg-teal-500';
    }
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Selector tab row */}
      <div className="flex flex-col gap-sm md:flex-row md:items-center justify-between">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Bảng công việc Kanban</h3>
          <p className="text-xs text-on-surface-variant">Lọc theo danh mục dự án để quản lý luồng công việc cụ thể</p>
        </div>
        <div className="flex gap-xs overflow-x-auto pb-2 custom-scrollbar">
          {uniqueProjects.map((project) => (
            <button
              key={project}
              onClick={() => setSelectedProject(project)}
              className={`px-md py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border ${
                selectedProject === project
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container'
              }`}
            >
              {project}
            </button>
          ))}
        </div>
      </div>

      {/* Two columns: Pending (Đang chờ) vs Completed (Hoàn thành) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {/* Column 1: PENDING */}
        <div className="p-md bg-[#f1f3ff] rounded-xl border border-outline-variant flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-xs">
            <div className="flex items-center gap-xs">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h4 className="font-headline-sm font-bold text-on-surface">Cần làm ({pendingTasks.length})</h4>
            </div>
            <span className="text-xs bg-primary-container text-on-primary-container px-2 py-0.5 rounded-md font-bold">
              Đang chờ
            </span>
          </div>

          <div className="space-y-md flex-1 overflow-y-auto max-h-[600px] pr-xs custom-scrollbar">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onEditTask(task)}
                  className="p-md bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm hover:border-primary-container hover:shadow-md transition-all cursor-pointer relative group overflow-hidden"
                >
                  {/* Left priority accent strip */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${getPriorityColor(task.priority)}`} />

                  <div className="pl-xs flex flex-col justify-between h-full gap-sm">
                    <div className="space-y-xs">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                          STT: {task.stt}
                        </span>
                        <span className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 ${
                          task.priority === 'khan_cap' ? 'bg-rose-50 text-rose-700' :
                          task.priority === 'cao' ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'
                        }`}>
                          {task.priority === 'khan_cap' ? 'Khẩn cấp' :
                           task.priority === 'cao' ? 'Ưu tiên cao' : 'Bình thường'}
                        </span>
                      </div>
                      <h5 className="font-semibold text-body-lg text-on-surface group-hover:text-primary transition-colors">
                        {task.title}
                      </h5>
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        {task.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-outline-variant/30 pt-xs">
                      <div className="flex items-center gap-xs">
                        {task.assignedUser.avatarUrl ? (
                          <img
                            src={task.assignedUser.avatarUrl}
                            alt=""
                            className="w-6 h-6 rounded-full border border-outline-variant"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">AN</div>
                        )}
                        <span className="text-xs text-on-surface-variant font-medium truncate max-w-[100px]">{task.assignedUser.name}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStatus(task.id);
                        }}
                        className="flex items-center gap-base text-xs text-primary bg-primary/5 hover:bg-primary hover:text-white px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer border border-primary/20"
                      >
                        <span>Hoàn thành</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-on-surface-variant/40 flex flex-col items-center justify-center">
                <CheckCircle className="w-12 h-12 stroke-[1.2] mb-xs text-emerald-500 animate-bounce" />
                <p className="font-semibold text-body-md text-on-surface">Tất cả đều đã hoàn thành tốt!</p>
                <p className="text-xs max-w-xs mt-base">Không có công việc nào trong dự án {selectedProject} cần xử lý.</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: COMPLETED */}
        <div className="p-md bg-[#f1f3ff] rounded-xl border border-outline-variant flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-xs">
            <div className="flex items-center gap-xs">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h4 className="font-headline-sm font-bold text-on-surface">Đã Xong ({completedTasks.length})</h4>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
              Hoàn thành
            </span>
          </div>

          <div className="space-y-md flex-1 overflow-y-auto max-h-[600px] pr-xs custom-scrollbar">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onEditTask(task)}
                  className="p-md bg-surface-container-lowest/70 opacity-80 hover:opacity-100 rounded-lg border border-outline-variant shadow-sm hover:border-emerald-500 transition-all cursor-pointer relative overflow-hidden"
                >
                  {/* Left status accent strip (emerald check style) */}
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />

                  <div className="pl-xs flex flex-col justify-between h-full gap-sm">
                    <div className="space-y-xs">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                          STT: {task.stt}
                        </span>
                        <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                          ✓ Đã xong
                        </span>
                      </div>
                      <h5 className="font-semibold text-body-lg text-on-surface line-through decoration-emerald-600/50">
                        {task.title}
                      </h5>
                      <p className="text-xs text-on-surface-variant/70 line-clamp-2">
                        {task.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-outline-variant/30 pt-xs">
                      <div className="flex items-center gap-xs">
                        {task.assignedUser.avatarUrl ? (
                          <img
                            src={task.assignedUser.avatarUrl}
                            alt=""
                            className="w-6 h-6 rounded-full border border-outline-variant opacity-60"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 text-[9px] font-bold flex items-center justify-center">AN</div>
                        )}
                        <span className="text-xs text-on-surface-variant font-medium truncate max-w-[100px]">{task.assignedUser.name}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStatus(task.id);
                        }}
                        className="flex items-center gap-base text-xs text-on-surface-variant bg-surface-container hover:bg-rose-50 hover:text-rose-700 px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer border border-outline-variant"
                      >
                        <span>Làm lại</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-on-surface-variant/40 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center mb-xs">
                  ✓
                </div>
                <p className="font-semibold text-body-md text-on-surface">Chưa hoàn thành công việc nào</p>
                <p className="text-xs max-w-xs mt-base">Nhấp vào nút hoàn thành ở cột trái để bắt đầu di chuyển các thẻ.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
