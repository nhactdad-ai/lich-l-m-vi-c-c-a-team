export type Priority = 'khan_cap' | 'cao' | 'binh_thuong';
export type Status = 'dang_cho' | 'hoan_thanh';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  color?: string; // For text-based avatars like "AN" or other custom users
}

export interface Task {
  id: string;
  stt: string; // Formatting like "01", "02"
  title: string;
  description: string;
  priority: Priority;
  assignedUser: User;
  status: Status;
  dueDate?: string; // Optional due date
  project?: string; // Project category, e.g., "Marketing", "Sản phẩm", "Hỗ trợ"
}

export type NavTab = 'dashboard' | 'lich_trinh' | 'du_an' | 'bao_cao';

export interface TaskFilterOptions {
  search: string;
  priority: Priority | 'all';
  status: Status | 'all';
  project: string | 'all';
}

export type SortField = 'stt' | 'title' | 'priority' | 'status';
export type SortOrder = 'asc' | 'desc';
