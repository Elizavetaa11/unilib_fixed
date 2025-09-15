export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  year: number;
  pages: number;
  illustrations: number;
  price: number;
  branchId: number;
  copiesCount: number;
  studentsCount: number;
  faculties: string[];
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone?: string;
}

export interface Student {
  id: number;
  fullName: string;
  faculty: string;
  borrowedBooks: number[];
}

export interface Faculty {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export interface BookSearchFilters {
  title?: string;
  author?: string;
  branchId?: number;
  year?: number;
}

export interface BookStatistics {
  branchId: number;
  branchName: string;
  copiesCount: number;
  facultiesCount: number;
  faculties: string[];
}