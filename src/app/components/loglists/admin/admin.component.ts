import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LightLog } from '../../../models/lightlog.model';
import { DataService } from '../../../services/data.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  lightLogs$: Observable<LightLog[]>;
  Delete: any;
  selectedLightLogs: any;
  
  constructor(
  private data: DataService) {
    this.lightLogs$ = of([] as LightLog[]);
  }
   


  ngOnInit(): void {
    console.log("before getlightlogs")
    this.get();
    console.log("after getlightlogs")
  }

  get(): void{
    this.lightLogs$ = this.data.getLightLogs()
  }

  openNew() {
    throw new Error('Method not implemented.');
    }
    deleteSelectedLightLogs() {
    throw new Error('Method not implemented.');
    }
    deleteLightLog(_t38: any) {
    throw new Error('Method not implemented.');
    }
}
