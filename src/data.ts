import { Task, User } from './types';

export const DEFAULT_USERS: User[] = [
  {
    id: '1',
    name: 'Minh Anh',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4VyeIr_IUDB5ONsJhFyEN2exu_heQDSnMQqJfRcgQw3FQ4mAsX407XT6hKRkDCvDJ42Sjwh5AacTMt-ZmuNjbSZT-TdpfdfoJuIAHtVLlG3ar9y_VZKZIi-CQ1HcWnT9PC8_BvhpMgAEx41kmTG9htq13X0MaFZ6AVrOJGlbnTtfUh721yG3bSIOP6SYzDjMWx2_qahlmqqXDeOrlmo2nLTOmwQIZS2bSr_zuOx-qbGy4UIeBFFBkSyo5MULQkK6IhGHehJpl2KI'
  },
  {
    id: '2',
    name: 'Tuấn Kiệt',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTxcftkNCTB17CgncW20_Gqduxg8E-WLtKdlhgyMhpHRlpt2zMN-QkyB9gvKpLO-s_t7abk4SYteEC-AGDNyrfa-sptI8S9GstEh8XXB4jy7iWEM16K2Fq8VnzFK530p19aPfIAh0HdSPJWNxxgJ7kMVnGBPYJ07J_PERC86n18_nEi__vgXTKbyaZq5tsJVbHX4HaQ0OmHpEFOiUDPWxltnWwFDpAQd74Y9hI8qJSR29Ed0XZmBbiTtyFLyZVnA4nOu4q2VmZf0U'
  },
  {
    id: '3',
    name: 'An Nguyễn',
    color: '#0052cc' // Text avatar
  },
  {
    id: '4',
    name: 'Đức Duy',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSUBcDIqSQplSJxTpqalZUtOaWxxx8T67PoZoThxy7C2hA2eRDqlgnExJBeh07pb2XToKLoJFhcxUcIQSsDY9NzZvODPzTy4ccTpz-Or4JogaGaHsVowyz_OoCUgv8F3-7fCQXCSMuoIWYkW8K2zlZnkaliv-7OLO9mhpnk9o_l87ELOKfdLSeVQFf1SsfHChcDiYUWbXXoIu3Mh0-6gHl1f7SdY1AvmMxeuWliHBZGSQkkdq-OLSa-VTbl1O6C3DJ7rrVIYSCx-A'
  }
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    stt: '01',
    title: 'Họp chiến lược Q3',
    description: 'Thảo luận mục tiêu tăng trưởng quý tới',
    priority: 'cao',
    assignedUser: DEFAULT_USERS[0],
    status: 'dang_cho',
    project: 'Sản phẩm',
    dueDate: '2026-06-25'
  },
  {
    id: 'task-2',
    stt: '02',
    title: 'Review thiết kế UI',
    description: 'Duyệt lại bản mockup cho Mobile App',
    priority: 'binh_thuong',
    assignedUser: DEFAULT_USERS[1],
    status: 'hoan_thanh',
    project: 'Thiết kế',
    dueDate: '2026-06-22'
  },
  {
    id: 'task-3',
    stt: '03',
    title: 'Gửi báo cáo tuần',
    description: 'Tổng hợp dữ liệu từ các bộ phận',
    priority: 'binh_thuong',
    assignedUser: DEFAULT_USERS[2],
    status: 'dang_cho',
    project: 'Hành chính',
    dueDate: '2026-06-26'
  },
  {
    id: 'task-4',
    stt: '04',
    title: 'Fix bug Login flow',
    description: 'Lỗi không nhận OTP từ SMS',
    priority: 'khan_cap',
    assignedUser: DEFAULT_USERS[3],
    status: 'dang_cho',
    project: 'Kỹ thuật',
    dueDate: '2026-06-23'
  },
  {
    id: 'task-5',
    stt: '05',
    title: 'Tối ưu hóa cơ sở dữ liệu',
    description: 'Cải thiện thời gian phản hồi cho các câu truy vấn báo cáo',
    priority: 'cao',
    assignedUser: DEFAULT_USERS[1],
    status: 'hoan_thanh',
    project: 'Kỹ thuật',
    dueDate: '2026-06-24'
  },
  {
    id: 'task-6',
    stt: '06',
    title: 'Thiết kế Banner Marketing',
    description: 'Phục vụ chiến dịch quảng bá tính năng mới Q3',
    priority: 'binh_thuong',
    assignedUser: DEFAULT_USERS[0],
    status: 'hoan_thanh',
    project: 'Thiết kế',
    dueDate: '2026-06-28'
  },
  {
    id: 'task-7',
    stt: '07',
    title: 'Hợp đồng đối tác mới',
    description: 'Rà soát các điều khoản hợp tác với bên nhà cung cấp SMS',
    priority: 'cao',
    assignedUser: DEFAULT_USERS[2],
    status: 'hoan_thanh',
    project: 'Hành chính',
    dueDate: '2026-06-30'
  },
  {
    id: 'task-8',
    stt: '08',
    title: 'Kiểm thử bảo mật định kỳ',
    description: 'Chạy pentest định kỳ cho hệ thống xác thực',
    priority: 'khan_cap',
    assignedUser: DEFAULT_USERS[3],
    status: 'hoan_thanh',
    project: 'Kỹ thuật',
    dueDate: '2026-06-29'
  }
];

export const LOCAL_STORAGE_KEY = 'taskflow_data';

export function loadTasksFromStorage(): Task[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load tasks from local storage:', error);
  }
  return DEFAULT_TASKS;
}

export function saveTasksToStorage(tasks: Task[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to local storage:', error);
  }
}
