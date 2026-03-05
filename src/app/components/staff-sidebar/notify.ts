import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notify.html',
  styleUrls: ['./notify.css'],
})
export class NotifyComponent implements OnDestroy {
  showToastVisible = false;
  toastMessage = '';
  private toastTimer: any;

  showToast(message: string, duration = 2000) {
    if (this.toastTimer) clearTimeout(this.toastTimer);

    this.toastMessage = message;
    this.showToastVisible = true;

    this.toastTimer = setTimeout(() => {
      this.showToastVisible = false;
    }, duration);
  }

  ngOnDestroy() {
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }
}
