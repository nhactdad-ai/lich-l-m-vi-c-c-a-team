import React, { useState, useEffect } from 'react';
import { NavTab, Task } from './types';
import { loadTasksFromStorage, saveTasksToStorage, DEFAULT_USERS } from './data';
import ScheduleView from './components/ScheduleView';
import DashboardView from './components/DashboardView';
import ProjectsView from './components/ProjectsView';
import ReportsView from './components/ReportsView';
import TaskModal from './components/TaskModal';
import { CalendarDays, Bell, Search, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('lich_trinh'); // Default to Lịch trình as in the screenshot
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial tasks on mount
  useEffect(() => {
    setTasks(loadTasksFromStorage());
  }, []);

  // Save tasks on changes
  const updateTasksStateAndStorage = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasksToStorage(newTasks);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle status checkbox handler
  const handleToggleStatus = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextStatus = t.status === 'hoan_thanh' ? 'dang_cho' : 'hoan_thanh';
        const actionLabel = nextStatus === 'hoan_thanh' ? 'Hoàn thành' : 'Đặt lại';
        showToast(`Đã cập nhật: "${t.title}" thành ${actionLabel}!`);
        return { ...t, status: nextStatus };
      }
      return t;
    });
    updateTasksStateAndStorage(updated);
  };

  // Create or Update task handler
  const handleSaveTask = (formData: Omit<Task, 'id' | 'stt'> & { id?: string }) => {
    if (formData.id) {
      // Editing existing task
      const updated = tasks.map((t) => {
        if (t.id === formData.id) {
          showToast(`Đã lưu thay đổi cho đầu việc: "${formData.title}"`);
          return {
            ...t,
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            assignedUser: formData.assignedUser,
            status: formData.status,
            project: formData.project,
            dueDate: formData.dueDate
          };
        }
        return t;
      });
      updateTasksStateAndStorage(updated);
    } else {
      // Adding brand new task
      const newSttNum = tasks.length + 1;
      const formattedStt = newSttNum < 10 ? `0${newSttNum}` : `${newSttNum}`;

      const newTask: Task = {
        id: `task-${Date.now()}`,
        stt: formattedStt,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        assignedUser: formData.assignedUser,
        status: formData.status,
        project: formData.project,
        dueDate: formData.dueDate
      };

      const updated = [...tasks, newTask];
      updateTasksStateAndStorage(updated);
      showToast(`Đã thêm thành công đầu việc: "${formData.title}"`);
    }
    setIsModalOpen(false);
  };

  // Delete task handler
  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    const updated = tasks.filter((t) => t.id !== id);
    
    // Re-index remaining task STTs
    const reindexed = updated.map((t, index) => {
      const idx = index + 1;
      return {
        ...t,
        stt: idx < 10 ? `0${idx}` : `${idx}`
      };
    });

    updateTasksStateAndStorage(reindexed);
    if (taskToDelete) {
      showToast(`Đã xóa hoàn toàn đầu việc: "${taskToDelete.title}"`);
    }
  };

  // Quick Action triggers
  const handleAddTaskClick = () => {
    setSelectedTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditTaskClick = (task: Task) => {
    setSelectedTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Date and Progress calculations
  const getVietnameseDateString = () => {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    // Setting default or fallback to provide the same exact day name (Tuesday)
    const today = new Date('2026-06-23T05:38:07'); 
    
    const dayName = days[today.getDay()];
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return `${dayName}, ${date} Tháng ${month}, ${year}`;
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'hoan_thanh').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg text-on-surface flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 animate-fade-in pointer-events-none">
          <div className="bg-slate-900 text-white px-md py-sm rounded-lg shadow-lg flex items-center gap-xs text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* TopAppBar (Desktop Navigation Header) */}
      <header className="w-full sticky top-0 bg-surface-container-lowest z-40 border-b border-outline-variant flex justify-between items-center px-lg py-md md:px-xl">
        <div className="flex items-center gap-md md:gap-xl">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-xs cursor-pointer active:opacity-80 transition-all"
          >
            <CalendarDays className="w-6 h-6 text-primary" />
            <h1 className="font-headline text-headline-md font-extrabold text-primary tracking-tight">
              TaskFlow
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-lg ml-sm lg:ml-md">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'lich_trinh', label: 'Lịch trình' },
              { id: 'du_an', label: 'Dự án' },
              { id: 'bao_cao', label: 'Báo cáo' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as NavTab)}
                  className={`text-body-md py-2 font-semibold relative transition-colors cursor-pointer ${
                    isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action icons right of Header */}
        <div className="flex items-center gap-md">
          <button
            onClick={() => showToast('Hãy nhập dữ liệu vào ô tìm kiếm ở danh sách công việc bên dưới!')}
            className="p-xs hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            title="Tìm kiếm"
          >
            <Search className="w-5 h-5 text-on-surface-variant" />
          </button>
          <button
            onClick={() => showToast('Bạn chưa có thông báo mới.')}
            className="p-xs hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-5 h-5 text-on-surface-variant" />
          </button>
          
          {/* Professional Avatar */}
          <div
            onClick={() => showToast(`Đang đăng nhập bằng tài khoản: ${DEFAULT_USERS[1].name}`)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container cursor-pointer active:opacity-80 transition-opacity"
            title="Hồ sơ cá nhân"
          >
            <img
              className="w-full h-full object-cover"
              src={DEFAULT_USERS[1].avatarUrl}
              alt="Hồ sơ cá nhân"
            />
          </div>
        </div>
      </header>

      {/* Main content wrapper */}
      <main className="flex-grow px-md py-md md:px-xl md:py-lg max-w-6xl mx-auto w-full space-y-md md:space-y-lg">
        
        {/* Mobile Navigation tab bar */}
        <div className="flex md:hidden border-b border-outline-variant bg-surface-container-lowest p-2 rounded-xl justify-around gap-xs shadow-sm">
          {[
            { id: 'dashboard', label: 'General' },
            { id: 'lich_trinh', label: 'Lịch trình' },
            { id: 'du_an', label: 'Dự án' },
            { id: 'bao_cao', label: 'Báo cáo' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NavTab)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard Summary Block (Wide upper section matching Today card) */}
        <section className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-md">
            <div>
              <h2 className="font-headline text-headline-lg font-extrabold text-on-surface">Hôm nay</h2>
              <p className="text-body-lg text-on-surface-variant mt-1 font-semibold">
                {getVietnameseDateString()}
              </p>
            </div>
            
            {/* Right progress indicator bar */}
            <div className="flex flex-col items-end gap-xs w-full md:w-1/3">
              <div className="flex justify-between w-full mb-base">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Tiến độ công việc
                </span>
                <span className="text-xs bg-tertiary-container text-on-tertiary-container font-extrabold px-3 py-1 rounded-full px-sm py-xs">
                  {progressPercent}% Hoàn thành
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                <motion.div
                  className="bg-primary h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tab view contents switching */}
        <section className="pb-24">
          {activeTab === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              onAddTaskClick={handleAddTaskClick}
              onTabSwitch={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'lich_trinh' && (
            <ScheduleView
              tasks={tasks}
              onToggleStatus={handleToggleStatus}
              onEditTask={handleEditTaskClick}
              onAddTaskClick={handleAddTaskClick}
            />
          )}

          {activeTab === 'du_an' && (
            <ProjectsView
              tasks={tasks}
              onToggleStatus={handleToggleStatus}
              onEditTask={handleEditTaskClick}
            />
          )}

          {activeTab === 'bao_cao' && (
            <ReportsView tasks={tasks} />
          )}
        </section>
      </main>

      {/* Floating Action Button (FAB with interactive labels) */}
      <button
        onClick={handleAddTaskClick}
        className="fixed bottom-lg right-lg w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-40 group cursor-pointer shadow-lg hover:shadow-primary-container/40"
        id="fab"
        title="Thêm công việc mới"
      >
        <Plus className="w-9 h-9" />
        <span className="absolute right-full mr-md px-md py-sm bg-indigo-950 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
          Thêm công việc mới
        </span>
      </button>

      {/* Footer (Desktop Style links and credentials) */}
      <footer className="w-full mt-auto bg-surface-container-low border-t border-outline-variant">
        <div className="max-w-6xl mx-auto px-lg py-lg md:px-xl flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex items-center gap-sm">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span className="font-headline text-body-lg font-bold text-on-surface">TaskFlow</span>
            <span className="text-xs text-on-surface-variant ml-sm md:ml-md font-medium">
              © 2024-2026 Design by Efficient Flow
            </span>
          </div>
          <div className="flex gap-lg md:gap-xl">
            <button
              onClick={() => showToast('Chính sách bảo mật đã được cập nhật thành công.')}
              className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Chính sách bảo mật
            </button>
            <button
              onClick={() => showToast('Điều khoản sử dụng áp dụng từ ngày 01/01/2026.')}
              className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Điều khoản sử dụng
            </button>
            <button
              onClick={() => showToast('Liên hệ trung tâm trợ giúp qua hotline: 1900-8888.')}
              className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Trung tâm trợ giúp
            </button>
          </div>
        </div>
      </footer>

      {/* Save / Edit task modal form */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        taskToEdit={selectedTaskToEdit}
      />
    </div>
  );
}
