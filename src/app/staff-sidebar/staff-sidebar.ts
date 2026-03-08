import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VSStaff, User, Department } from '../models/vsstaff';
import { Vsstaff } from '../services/vsstaff';
import { Subscription } from 'rxjs';
import { DepartmentTreeComponent } from '../components/department-tree/department-tree';

type StaffListType = 'managers' | 'departments' | 'users';

@Component({
  selector: 'app-staff-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, DepartmentTreeComponent],
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

  private toastTimer: any;

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

    // Đổ dữ liệu vào Set cho TẤT CẢ các loại popup
    currentItems.forEach((item) => this.tempSelectedIds.add(item.id));

    // Nếu là phòng ban thì mới tính toán mở rộng cây
    if (type === 'dept') {
      this.autoExpandSelectedDepts();
    }
  }

  toggleSelection = (id: number) => {
    if (this.tempSelectedIds.has(id)) {
      this.tempSelectedIds.delete(id);
    } else {
      this.tempSelectedIds.add(id);
    }
    // Thêm dòng này để debug xem ID đã vào Set chưa
    console.log('Current IDs:', Array.from(this.tempSelectedIds));
  };

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
    this.showToast('Cập nhật thành công ✅');
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
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  expandedIds = new Set<number>();

  toggleExpand = (id: number) => {
    if (this.expandedIds.has(id)) this.expandedIds.delete(id);
    else this.expandedIds.add(id);
  };

  isExpanded = (id: number) => {
    return this.expandedIds.has(id);
  };

  showToastVisible = false;
  toastMessage = '';

  showToast(message: string, duration = 2000) {
    if (this.toastTimer) clearTimeout(this.toastTimer);

    this.toastMessage = message;
    this.showToastVisible = true;

    this.toastTimer = setTimeout(() => {
      this.showToastVisible = false;
    }, duration);
  }

  isSelected = (id: number) => {
    return this.tempSelectedIds.has(id);
  };

  private autoExpandSelectedDepts() {
    this.expandedIds.clear();

    const findAndExpand = (nodes: Department[]): boolean => {
      let hasSelectedInFamily = false;

      for (const node of nodes) {
        let isAnyChildSelected = false;

        if (node.children && node.children.length > 0) {
          // Đệ quy để kiểm tra xem trong đám con cháu có đứa nào được chọn không
          isAnyChildSelected = findAndExpand(node.children);
        }

        // QUAN TRỌNG: Chỉ mở node cha nếu có con/cháu bên trong được chọn
        if (isAnyChildSelected) {
          this.expandedIds.add(node.id);
          hasSelectedInFamily = true;
        }
        // Nếu chính node này được chọn, báo cho cha nó biết để cha nó mở ra
        else if (this.tempSelectedIds.has(node.id)) {
          hasSelectedInFamily = true;
        }
      }
      return hasSelectedInFamily;
    };

    findAndExpand(this.allDepartments);
  }
}
