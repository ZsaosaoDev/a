import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VSStaff, User } from '../models/vsstaff';

@Injectable({
  providedIn: 'root',
})
export class Vsstaff {
  private allUsers: User[] = [
    { id: 1, name: 'Nguyễn Văn A ' },
    { id: 2, name: 'Trần Thị B ' },
    { id: 3, name: 'Lê Văn C' },
    { id: 4, name: 'Phạm Thị D' },
    { id: 5, name: 'Hoàng Văn E' },
    { id: 6, name: 'Đặng Thị F' },
    { id: 7, name: 'Bùi Văn G' },
  ];

  private fakeData: VSStaff[] = [
    {
      id: 1,
      name: 'VS Staff A',
      managers: [
        { id: 1, name: 'Manager 1' },
        { id: 2, name: 'Manager 2' },
      ],
      users: [
        { id: 3, name: 'User 1' },
        { id: 4, name: 'User 2' },
      ],
      departments: [
        { id: 1, name: 'HR' },
        { id: 2, name: 'IT' },
      ],
    },
    {
      id: 2,
      name: 'VS Staff B',
      managers: [{ id: 5, name: 'Manager 3' }],
      users: [{ id: 6, name: 'User 3' }],
      departments: [{ id: 3, name: 'Finance' }],
    },
  ];

  getAll(): Observable<VSStaff[]> {
    return of(this.fakeData);
  }

  getById(id: number): Observable<VSStaff | undefined> {
    const result = this.fakeData.find((x) => x.id === id);
    return of(result);
  }

  getAvailableUsers(): Observable<User[]> {
    return of(this.allUsers);
  }
}
