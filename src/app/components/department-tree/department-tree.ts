import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-tree.html',
  styleUrls: ['./department-tree.css'],
})
export class DepartmentTreeComponent {
  @Input() list: any[] = [];

  @Input() isSelected!: (id: number) => boolean;
  @Input() toggleSelection!: (id: number) => void;

  @Input() isExpanded!: (id: number) => boolean;
  @Input() toggleExpand!: (id: number) => void;
}
