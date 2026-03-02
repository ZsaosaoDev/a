import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vsstaff } from '../../services/vsstaff';
import { VSStaff } from '../../models/vsstaff';
import { StaffSidebarComponent } from '../../staff-sidebar/staff-sidebar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, StaffSidebarComponent],
  templateUrl: './candidate-list.html',
  styleUrls: ['./candidate-list.css'],
})
export class CandidateList implements OnInit, OnDestroy {
  staffList: VSStaff[] = [];
  selectedStaff: VSStaff | null = null;

  private subscription = new Subscription();

  constructor(private vsstaffService: Vsstaff) {}

  ngOnInit(): void {
    const sub = this.vsstaffService.getAll().subscribe({
      next: (data) => {
        this.staffList = [...data];
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.subscription.add(sub);
  }

  selectedStaffId: number | null = null;
  viewDetail(id: number) {
    this.selectedStaffId = id;
  }

  closeDetail() {
    this.selectedStaffId = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
