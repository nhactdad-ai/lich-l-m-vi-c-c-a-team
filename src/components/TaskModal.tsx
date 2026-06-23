import React, { useState, useEffect } from 'react';
import { Task, Priority, Status, User } from '../types';
import { DEFAULT_USERS } from '../data';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'stt'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  taskToEdit?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSave, onDelete, taskToEdit }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('binh_thuong');
  const [assignedUserId, setAssignedUserId] = useState('1');
  const [project, setProject] = useState('Sản phẩm');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<Status>('dang_cho');

  // Load task parameters on edit
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
      setAssignedUserId(taskToEdit.assignedUser.id);
      setProject(taskToEdit.project || 'Sản phẩm');
      setDueDate(taskToEdit.dueDate || '');
      setStatus(taskToEdit.status);
    } else {
      // Set defaults for new task
      setTitle('');
      setDescription('');
      setPriority('binh_thuong');
      setAssignedUserId('1');
      setProject('Sản phẩm');
      setDueDate(new Date().toISOString().split('T')[0]);
      setStatus('dang_cho');
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedUser = DEFAULT_USERS.find(u => u.id === assignedUserId) || DEFAULT_USERS[0];

    onSave({
      id: taskToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      priority,
      assignedUser,
      status,
      project,
      dueDate: dueDate || undefined
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="w-full max-w-lg bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xl overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-headline-sm font-bold text-on-surface">
                {taskToEdit ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
              </h3>
              <button
                onClick={onClose}
                className="p-xs text-on-surface-variant hover:bg-surface-container rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-lg flex-1 overflow-y-auto space-y-md max-h-[70vh]">
              {/* Title */}
              <div className="flex flex-col gap-xs">
                <label className="text-label-md font-bold text-on-surface-variant uppercase">
                  Đầu việc *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tên công việc cần làm..."
                  className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-xs">
                <label className="text-label-md font-bold text-on-surface-variant uppercase">
                  Mô tả công việc
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập ghi chú hoặc mô tả ngắn gọn..."
                  rows={3}
                  className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {/* Project / Category */}
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-bold text-on-surface-variant uppercase">
                    Dự án / Phân loại
                  </label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary-container"
                  >
                    <option value="Sản phẩm">Sản phẩm</option>
                    <option value="Thiết kế">Thiết kế</option>
                    <option value="Kỹ thuật">Kỹ thuật</option>
                    <option value="Hành chính">Hành chính</option>
                    <option value="Chiến lược">Chiến lược</option>
                  </select>
                </div>

                {/* Due Date */}
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-bold text-on-surface-variant uppercase">
                    Hạn hoàn thành
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              {/* Assigned User */}
              <div className="flex flex-col gap-xs">
                <label className="text-label-md font-bold text-on-surface-variant uppercase">
                  Người làm
                </label>
                <div className="grid grid-cols-2 gap-xs">
                  {DEFAULT_USERS.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => setAssignedUserId(user.id)}
                      className={`flex items-center gap-sm p-sm border rounded-lg text-left transition-all cursor-pointer ${
                        assignedUserId === user.id
                          ? 'border-primary-container bg-surface-container-low ring-1 ring-primary-container font-semibold'
                          : 'border-outline-variant hover:bg-surface-container-low/50'
                      }`}
                    >
                      {user.avatarUrl ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant flex-shrink-0">
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-container text-on-primary-container text-xs font-bold leading-none flex-shrink-0">
                          AN
                        </div>
                      )}
                      <span className="text-body-md truncate">{user.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-xs">
                <label className="text-label-md font-bold text-on-surface-variant uppercase">
                  Mức độ ưu tiên
                </label>
                <div className="flex gap-sm">
                  {([
                    { value: 'binh_thuong', label: 'Bình thường', color: 'accent-teal border-teal-200 text-[#004b59]' },
                    { value: 'cao', label: 'Ưu tiên cao', color: 'accent-amber border-amber-200 text-[#93000a]' },
                    { value: 'khan_cap', label: 'Khẩn cấp', color: 'accent-rose border-rose-300 text-rose-800' }
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPriority(opt.value)}
                      className={`flex-1 py-sm px-md border rounded-lg text-center font-semibold text-body-md transition-all cursor-pointer ${
                        priority === opt.value
                          ? opt.value === 'khan_cap'
                            ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-500'
                            : opt.value === 'cao'
                            ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-500'
                            : 'bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-500'
                          : 'border-outline-variant hover:bg-surface-container-low/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Toggles (Show checkbox status ONLY on edit) */}
              {taskToEdit && (
                <div className="flex items-center justify-between p-sm border border-outline-variant rounded-lg bg-surface-container-low/50">
                  <div className="flex flex-col">
                    <span className="font-semibold text-body-md text-on-surface">Trạng thái công việc</span>
                    <span className="text-xs text-on-surface-variant">Đánh dấu đã hoàn thành đầu việc này</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus(status === 'hoan_thanh' ? 'dang_cho' : 'hoan_thanh')}
                    className={`flex items-center gap-xs px-sm py-xs rounded-full border transition-all cursor-pointer ${
                      status === 'hoan_thanh'
                        ? 'bg-tertiary-container text-on-tertiary-container border-[#76e2ff]'
                        : 'bg-surface-container border-outline-variant text-on-surface-variant'
                    }`}
                  >
                    <Check className={`w-4 h-4 ${status === 'hoan_thanh' ? 'opacity-100' : 'opacity-0'}`} />
                    <span className="text-xs font-semibold uppercase">
                      {status === 'hoan_thanh' ? 'Đã xong' : 'Chờ làm'}
                    </span>
                  </button>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="px-lg py-md border-t border-outline-variant flex justify-between bg-surface-container-low">
              {taskToEdit && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
                      onDelete(taskToEdit.id);
                      onClose();
                    }
                  }}
                  className="px-md py-sm bg-rose-50 text-rose-700 font-semibold border border-rose-200 hover:bg-rose-100/80 rounded-lg text-body-md transition-colors cursor-pointer"
                >
                  Xóa bỏ
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-sm">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-lg py-sm text-on-surface-variant hover:bg-surface-container font-semibold rounded-lg text-body-md transition-colors cursor-pointer border border-outline-variant"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!title.trim()}
                  className="px-lg py-sm bg-primary-container text-on-primary font-bold rounded-lg text-body-md shadow-sm hover:bg-primary-container/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Lưu lại
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
