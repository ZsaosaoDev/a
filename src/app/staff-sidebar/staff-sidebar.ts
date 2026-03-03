import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VSStaff, User, Department } from '../models/vsstaff';
import { Vsstaff } from '../services/vsstaff';
import { Subscription } from 'rxjs';

// Định nghĩa kiểu dữ liệu cho danh sách section
type StaffListType = 'managers' | 'departments' | 'users';

@Component({
  selector: 'app-staff-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-sidebar.html',
  styleUrls: ['./staff-sidebar.css'],
})
export class StaffSidebarComponent implements OnInit, OnDestroy {
  @Input() staffId!: number;
  @Output() close = new EventEmitter<void>();

  staff: VSStaff | null = null;
  allUsers: User[] = [];
  allDepartments: Department[] = [];
  loading = false;
  isClosing = false;
  showManagerPopup = false;
  showUserPopup = false;
  showDeptPopup = false;
  searchText = '';
  tempSelectedIds = new Set<number>();
  private subscription = new Subscription();

  // Khai báo danh sách các mục hiển thị để HTML loop qua mà không lỗi type
  readonly sectionTypes: {
    key: StaffListType;
    label: string;
    popup: 'manager' | 'user' | 'dept';
  }[] = [
    { key: 'managers', label: 'Quản lý trực tiếp', popup: 'manager' },
    { key: 'departments', label: 'Phòng ban được sài', popup: 'dept' },
    { key: 'users', label: 'Người dùng được sài', popup: 'user' },
  ];

  constructor(private vsstaffService: Vsstaff) {}

  ngOnInit(): void {
    if (this.staffId) {
      this.loadStaff();
      this.loadAllUsers();
      this.loadDepartments();
    }
  }

  loadStaff() {
    this.loading = true;
    this.subscription.add(
      this.vsstaffService.getById(this.staffId).subscribe((res) => {
        this.staff = res ? structuredClone(res) : null;
        this.loading = false;
      }),
    );
  }

  loadAllUsers() {
    this.subscription.add(
      this.vsstaffService.getAvailableUsers().subscribe((u) => (this.allUsers = u)),
    );
  }

  loadDepartments() {
    this.subscription.add(
      this.vsstaffService.getDepartmentsTree().subscribe((d) => (this.allDepartments = d)),
    );
  }

  openPopup(type: 'manager' | 'user' | 'dept') {
    this.tempSelectedIds.clear();
    this.searchText = '';
    let currentItems: any[] = [];
    if (type === 'manager') {
      currentItems = this.staff?.managers || [];
      this.showManagerPopup = true;
    } else if (type === 'user') {
      currentItems = this.staff?.users || [];
      this.showUserPopup = true;
    } else if (type === 'dept') {
      currentItems = this.staff?.departments || [];
      this.showDeptPopup = true;
    }
    currentItems.forEach((item) => this.tempSelectedIds.add(item.id));
  }

  toggleSelection(id: number) {
    this.tempSelectedIds.has(id) ? this.tempSelectedIds.delete(id) : this.tempSelectedIds.add(id);
  }

  get isAllSelected(): boolean {
    const list = this.filteredUsers;
    return list.length > 0 && list.every((u) => this.tempSelectedIds.has(u.id));
  }

  toggleSelectAll() {
    const list = this.filteredUsers;
    if (this.isAllSelected) list.forEach((u) => this.tempSelectedIds.delete(u.id));
    else list.forEach((u) => this.tempSelectedIds.add(u.id));
  }

  get isAllDeptsSelected(): boolean {
    if (this.allDepartments.length === 0) return false;
    const allIds = this.getAllDeptIds(this.allDepartments);
    return allIds.every((id) => this.tempSelectedIds.has(id));
  }

  toggleSelectAllDepts() {
    const allIds = this.getAllDeptIds(this.allDepartments);
    if (this.isAllDeptsSelected) allIds.forEach((id) => this.tempSelectedIds.delete(id));
    else allIds.forEach((id) => this.tempSelectedIds.add(id));
  }

  private getAllDeptIds(list: Department[]): number[] {
    let ids: number[] = [];
    list.forEach((node) => {
      ids.push(node.id);
      if (node.children) ids = ids.concat(this.getAllDeptIds(node.children));
    });
    return ids;
  }

  confirmSelection(type: StaffListType) {
    if (!this.staff) return;
    if (type === 'managers' || type === 'users') {
      this.staff[type] = this.allUsers.filter((u) => this.tempSelectedIds.has(u.id));
    } else {
      const flatDepts = this.flattenDepts(this.allDepartments);
      this.staff.departments = flatDepts.filter((d) => this.tempSelectedIds.has(d.id));
    }
    this.closeAllPopups();
  }

  private flattenDepts(list: Department[]): Department[] {
    return list.reduce((acc: Department[], curr) => {
      acc.push(curr);
      if (curr.children) acc.push(...this.flattenDepts(curr.children));
      return acc;
    }, []);
  }

  closeAllPopups() {
    this.showManagerPopup = this.showUserPopup = this.showDeptPopup = false;
    this.searchText = '';
  }

  get filteredUsers(): User[] {
    const s = this.searchText.toLowerCase().trim();
    return s
      ? this.allUsers.filter((u) => u.name.toLowerCase().includes(s) || u.id.toString().includes(s))
      : this.allUsers;
  }

  removeItem(list: StaffListType, id: number) {
    if (this.staff)
      this.staff[list] = (this.staff[list] as any[]).filter((item: any) => item.id !== id);
  }

  onClose() {
    this.isClosing = true;
    setTimeout(() => this.close.emit(), 300);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
