import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VSStaff } from '../models/vsstaff';

@Injectable({
  providedIn: 'root',
})
export class Vsstaff {
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
}
