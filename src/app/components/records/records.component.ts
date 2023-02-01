import { Component } from '@angular/core';

import { Doctor } from '../../interfaces/doctor.interface';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css'],
})
export class RecordsComponent {
  constructor(private httpService: HttpService) {
    httpService.getAllDoctors().subscribe((result) => (this.doctors = result));
  }

  public doctors: Doctor[] = [];
  public selectedDoctorId = '';
}
