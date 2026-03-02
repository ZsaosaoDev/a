import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VSStaff } from '../models/vsstaff';
import { Vsstaff } from '../services/vsstaff';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-staff-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-sidebar.html',
  styleUrls: ['./staff-sidebar.css'],
})
export class StaffSidebarComponent implements OnInit, OnDestroy {
  @Input() staffId!: number;
  @Output() close = new EventEmitter<void>();

  staff: VSStaff | null = null;
  loading = false;
  isClosing = false; // Biến điều khiển class animation

  private subscription = new Subscription();

  constructor(private vsstaffService: Vsstaff) {}

  ngOnInit(): void {
    if (this.staffId) {
      this.loadStaff();
    }
  }

  loadStaff() {
    this.loading = true;
    const sub = this.vsstaffService.getById(this.staffId).subscribe({
      next: (res) => {
        this.staff = res ?? null;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
    this.subscription.add(sub);
  }

  onClose() {
    this.isClosing = true; // Kích hoạt hiệu ứng trượt ra

    // Đợi hiệu ứng CSS (300ms) chạy xong mới báo cho cha destroy component
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
