import { Component, OnInit } from '@angular/core';
import { Observable, map} from 'rxjs';
import { LightLog } from '../../../models/lightlog.model';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmationService, MessageService  } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { User } from '../../../models/user.model';
import { NavBar } from "../../shared/navbar/navbar.component";


@Component({
    selector: 'app-customer',
    standalone: true,
    templateUrl: './customer.component.html',
    styleUrl: './customer.component.css',
    imports: [SharedModule, NavBar]
})
export class CustomerComponent implements OnInit {
  lightLogs$!: Observable<LightLog[]>;
  Delete: any;
  selectedLightLogs: LightLog[] = [];
  deletedIds: number[] = [];

  user: User = {
    Id: "1",
    ProductId: "1",
    UserName: "Philip",
    Password: "Passw0rd",
    IsAdmin: false
  };
  
  constructor(
    private data: DataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute){}
   


  ngOnInit(): void {
    if (this.user.UserName == null && this.user.Password == null){
      this.router.navigate(['/login'])
    }
    console.log("before service call")
    this.lightLogs$ = this.data.getCustomerLightLogs(this.user.ProductId)
    console.log("after service call")
    
    this.lightLogs$ = this.lightLogs$.pipe(
      map((logs: LightLog[]) => {
        return logs.map((log: LightLog) => {
          const dateSentFirstPart = log.dateSent.substring(0, 10);
          const dateSentSecondPart = log.dateSent.substring(11,19);
          return {
            ...log,
            dateSent: dateSentFirstPart + '  ' + dateSentSecondPart // Concatenating parts...
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
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Collecting IDs before deletion
        this.selectedLightLogs.forEach(log => {
          this.deletedIds.push(log.id); // Pushing IDs into deletedIds array          
        });
        console.log(this.deletedIds);
        const response = this.data.deleteLightLogs(this.deletedIds);
        response.subscribe((res) => {
          if (res !== '') {
            this.resetPage();
            console.log("Page reset")
            this.deletedIds = [];
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Logs Deleted', life: 3000 });
          }
          
        });
      }
    });
  }
  

  resetPage(): void{
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'],{
      relativeTo: this.route
    })
  }

}
