import { Component } from '@angular/core';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css'],
})
export class RecordsComponent {
  public doctors = [
    {
      id: '1',
      fullName: 'name1',
    },
    {
      id: '2',
      fullName: 'name2',
    },
    {
      id: '3',
      fullName: 'name3',
    },
  ];
  public selectedDoctor = 'aaa';
}
