import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VSStaff, User, Department } from '../models/vsstaff';

@Injectable({
  providedIn: 'root',
})
export class Vsstaff {
  // Danh sách User gốc - dùng chung cho cả việc chọn và hiển thị ban đầu
  private allUsers: User[] = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
    { id: 3, name: 'Lê Văn C' },
    { id: 4, name: 'Phạm Thị D' },
    { id: 5, name: 'Hoàng Văn E' },
    { id: 6, name: 'Đặng Thị F' },
    { id: 7, name: 'Bùi Văn G' },
  ];

  private departmentTree: Department[] = [
    {
      id: 100,
      name: 'Tổng Công ty VS',
      children: [
        {
          id: 1,
          name: 'Khối Công nghệ',
          children: [
            { id: 11, name: 'Phòng Phát triển Phần mềm' },
            { id: 12, name: 'Phòng Hạ tầng & Bảo mật' },
            {
              id: 13,
              name: 'Trung tâm AI',
              children: [
                { id: 131, name: 'Tổ Xử lý ngôn ngữ (NLP)' },
                { id: 132, name: 'Tổ Thị giác máy tính' },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Khối Hành chính Nhân sự',
          children: [
            { id: 21, name: 'Phòng Tuyển dụng' },
            { id: 22, name: 'Phòng Đào tạo' },
          ],
        },
      ],
    },
    {
      id: 200,
      name: 'Văn phòng Đại diện Miền Nam',
      children: [
        { id: 3, name: 'Phòng Tài chính' },
        { id: 4, name: 'Phòng Kinh doanh' },
      ],
    },
  ];

  // SỬA TẠI ĐÂY: Dữ liệu fakeData sử dụng đúng tên từ danh sách allUsers
  private fakeData: VSStaff[] = [
    {
      id: 1,
      name: 'Nhân viên Thử nghiệm A',
      managers: [
        { id: 1, name: 'Nguyễn Văn A' }, // Manager giờ là Nguyễn Văn A thay vì Manager 1
        { id: 2, name: 'Trần Thị B' },
      ],
      users: [
        { id: 3, name: 'Lê Văn C' },
        { id: 4, name: 'Phạm Thị D' },
      ],
      departments: [
        { id: 11, name: 'Phòng Phát triển Phần mềm' },
        { id: 2, name: 'Khối Hành chính Nhân sự' },
      ],
    },
    {
      id: 2,
      name: 'Nhân viên Thử nghiệm B',
      managers: [{ id: 5, name: 'Hoàng Văn E' }],
      users: [{ id: 6, name: 'Đặng Thị F' }],
      departments: [{ id: 3, name: 'Phòng Tài chính' }],
    },
  ];

  getAll(): Observable<VSStaff[]> {
    return of(this.fakeData);
  }

  getById(id: number): Observable<VSStaff | undefined> {
    const result = this.fakeData.find((x) => x.id === id);
    // Dùng structuredClone để khi sửa ở Sidebar không bị "nhảy" data ở bảng ngay lập tức
    return of(result ? structuredClone(result) : undefined);
  }

  getAvailableUsers(): Observable<User[]> {
    return of(this.allUsers);
  }

  getDepartmentsTree(): Observable<Department[]> {
    return of(this.departmentTree);
  }

  // Thêm hàm Update để giả lập việc lưu dữ liệu
  updateStaff(updatedStaff: VSStaff): Observable<boolean> {
    const index = this.fakeData.findIndex((s) => s.id === updatedStaff.id);
    if (index !== -1) {
      this.fakeData[index] = structuredClone(updatedStaff);
      return of(true);
    }
    return of(false);
  }
}
