import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vsstaff } from '../../services/vsstaff';
import { VSStaff } from '../../models/vsstaff';
import { StaffSidebarComponent } from '../../staff-sidebar/staff-sidebar';
import { Subscription } from 'rxjs';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap'; // 1. Thêm import này

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule], // 2. Có thể bỏ StaffSidebarComponent ở đây vì mở bằng code rồi
  templateUrl: './candidate-list.html',
  styleUrls: ['./candidate-list.css'],
})
export class CandidateList implements OnInit, OnDestroy {
  staffList: VSStaff[] = [];
  private subscription = new Subscription();

  // 3. Inject NgbOffcanvas vào constructor
  constructor(
    private vsstaffService: Vsstaff,
    private offcanvasService: NgbOffcanvas,
  ) {}

  ngOnInit(): void {
    const sub = this.vsstaffService.getAll().subscribe({
      next: (data) => {
        this.staffList = [...data];
      },
      error: (err) => console.error(err),
    });
    this.subscription.add(sub);
  }

  // 4. Sửa lại hàm viewDetail
  viewDetail(id: number) {
    const offcanvasRef = this.offcanvasService.open(StaffSidebarComponent, {
      position: 'end', // Mở từ bên phải vào
      panelClass: 'w-50', // Nếu muốn sidebar rộng hơn (50% màn hình)
      backdrop: true, // Có lớp phủ mờ
    });

    // 5. Truyền ID vào @Input() staffId của Sidebar
    offcanvasRef.componentInstance.staffId = id;

    // 6. (Tùy chọn) Xử lý khi đóng Sidebar
    offcanvasRef.result.then(
      (result) => {
        /* Chạy khi gọi close() */
      },
      (reason) => {
        /* Chạy khi gọi dismiss() hoặc bấm ra ngoài */
      },
    );
  }

  // 7. Hàm closeDetail() có thể xóa vì thư viện tự lo rồi

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
