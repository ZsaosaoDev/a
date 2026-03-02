import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Quan trọng để dùng ngModel
import { VSStaff, User } from '../models/vsstaff';
import { Vsstaff } from '../services/vsstaff';
import { Subscription } from 'rxjs';

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
  loading = false;
  isClosing = false;

  // Trạng thái Popup
  showManagerPopup = false;
  showUserPopup = false;
  searchText = '';

  private subscription = new Subscription();

  constructor(private vsstaffService: Vsstaff) {}

  ngOnInit(): void {
    if (this.staffId) {
      this.loadStaff();
      this.loadAllUsers();
    }
  }

  loadStaff() {
    this.loading = true;
    this.subscription.add(
      this.vsstaffService.getById(this.staffId).subscribe((res) => {
        this.staff = res ?? null;
        this.loading = false;
      }),
    );
  }

  loadAllUsers() {
    this.subscription.add(
      this.vsstaffService.getAvailableUsers().subscribe((users) => {
        this.allUsers = users;
      }),
    );
  }

  // Logic lọc người dùng
  get filteredUsers(): User[] {
    const search = this.searchText.toLowerCase().trim();
    if (!search) return this.allUsers;
    return this.allUsers.filter(
      (u) => u.name.toLowerCase().includes(search) || u.id.toString().includes(search),
    );
  }

  // Thêm Manager
  addManager(user: User) {
    if (this.staff && !this.staff.managers.some((m) => m.id === user.id)) {
      this.staff.managers = [...this.staff.managers, user];
    }
    this.showManagerPopup = false;
    this.searchText = '';
  }

  // Thêm User liên kết
  addUser(user: User) {
    if (this.staff && !this.staff.users.some((u) => u.id === user.id)) {
      this.staff.users = [...this.staff.users, user];
    }
    this.showUserPopup = false;
    this.searchText = '';
  }

  // Xóa Manager/User
  removeItem(list: 'managers' | 'users', id: number) {
    if (this.staff) {
      this.staff[list] = this.staff[list].filter((item) => item.id !== id);
    }
  }

  onClose() {
    this.isClosing = true;
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //   saveStaff() {
  //     if (!this.staff) return;

  //     // Chuyển đổi từ mảng Object sang mảng ID bằng hàm .map()
  //     const payload = {
  //       id: this.staff.id,
  //       name: this.staff.name,
  //       managerIds: this.staff.managers.map((m) => m.id), // Lấy ra [1, 2]
  //       userIds: this.staff.users.map((u) => u.id), // Lấy ra [3, 4]
  //       departmentIds: this.staff.departments.map((d) => d.id),
  //     };

  //     console.log('Dữ liệu gửi lên server:', payload);

  //     // Gọi service để update
  //     this.vsstaffService.updateStaff(payload).subscribe({
  //       next: (res) => {
  //         console.log('Cập nhật thành công');
  //         this.onClose();
  //       },
  //       error: (err) => console.error('Lỗi khi lưu:', err),
  //     });
  //   }
}
