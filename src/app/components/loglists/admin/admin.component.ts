import { Component, OnInit } from '@angular/core';
import { Observable, map} from 'rxjs';
import { LightLog } from '../../../models/lightlog.model';
import { DataService } from '../../../services/data.service';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  lightLogs$!: Observable<LightLog[]>;
  Delete: any;
  selectedLightLogs: LightLog[] = [];
  
  constructor(
    private data: DataService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute){}
   


  ngOnInit(): void {
    this.lightLogs$ = this.data.getLightLogs()
    
    this.lightLogs$ = this.lightLogs$.pipe(
      map((logs: LightLog[]) => {
        return logs.map((log: LightLog) => {
          const dateSentFirstPart = log.dateSent.substring(0, 10);
          const dateSentSecondPart = log.dateSent.substring(11,19);
          // Map the split parts to the new FE_LightLog interface
          return {
            ...log,
            dateSent: dateSentFirstPart + '  ' + dateSentSecondPart // Concatenating parts for illustration
          };
        });
      })
    );
  }



  deleteLightLog(entity: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete lightlog number ' + entity.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const response = this.data.deleteLightLog(entity.id);
        response.subscribe((res) => {
          if (res !== '') {
            this.resetPage();
          }
        });
      }
  });
    
  }


  deleteSelectedLightLogs() {
  throw new Error('Method not implemented.');
  }

  resetPage(): void{
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'],{
      relativeTo: this.route
    })
  }


}
