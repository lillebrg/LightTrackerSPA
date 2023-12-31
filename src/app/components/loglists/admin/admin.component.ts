import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LightLog } from '../../../models/lightlog.model';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { NavBar } from "../../shared/navbar/navbar.component";
import { User } from '../../../models/user.model';
import { UserdataService } from '../../../services/userdata.service';


@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  imports: [SharedModule, NavBar]
})
export class AdminComponent implements OnInit {
  lightLogs$!: Observable<LightLog[]>;
  Delete: any;
  selectedLightLogs: LightLog[] = [];
  deletedIds: number[] = [];
  componentTitle: string = "";
  timeSesPerHour: Number[] = [];
  sortField: string = 'dateSent';
  sortOrder: number = 1;
  

  user: User = {
    id: null,
    productId: "",
    userName: null,
    password: null,
    isAdmin: null,
  };

  constructor(
    private data: DataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private userDataService: UserdataService) { }



  ngOnInit(): void {
    const userData = this.userDataService.getUser();
    this.user = {
      id: userData.id,
        productId: userData.productId,
        userName: userData.userName,
        password: userData.password,
        isAdmin: userData.isAdmin
    }

    if (this.user.isAdmin == false || this.user.isAdmin == null){
      this.router.navigate(['/'])
    }

    this.lightLogs$ = this.data.getLightLogs()

    this.lightLogs$ = this.lightLogs$.pipe(
      map((logs: LightLog[]) => {
        return logs.map((log: LightLog) => {
          const dateSentFirstPart = log.dateSent.substring(0, 10);
          const dateSentSecondPart = log.dateSent.substring(11, 19);
          return {
            ...log,
            dateSent: dateSentFirstPart + '  ' + dateSentSecondPart // Concatenating parts...
          };
        });
      }),
      map((logs: LightLog[]) => this.sortData(logs)) // Sort data initially
    );
  }

  onSort(event: any) {
    this.sortField = event.field;
    this.sortOrder = (event.order === 1) ? 1 : -1;

    this.lightLogs$ = this.lightLogs$.pipe(
      map((logs: LightLog[]) => this.sortData(logs)) // Sort data on p-sortIcon click
    );
  }

  sortData(logs: LightLog[]): LightLog[] {
    return logs.sort((a, b) => {
      const valueA = (a as any)[this.sortField]; // Type assertion to any
      const valueB = (b as any)[this.sortField]; // Type assertion to any
      if (valueA < valueB) return -1 * this.sortOrder;
      if (valueA > valueB) return 1 * this.sortOrder;
      return 0;
    });
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


  resetPage(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], {
      relativeTo: this.route
    })
  }

}

