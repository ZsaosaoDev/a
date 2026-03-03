export interface User {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  children?: Department[];
}

export interface VSStaff {
  id: number;
  name: string;
  managers: User[];
  users: User[];
  departments: Department[];
}
