import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LightLog } from '../../../models/lightlog.model';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { User } from '../../../models/user.model';
import { NavBar } from "../../shared/navbar/navbar.component";
import { ElectricPrices } from '../../../models/elecprices.model'


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
  sortField: string = 'dateSent';
  sortOrder: number = 1;

  //el API variables
  elPrices$!: Observable<ElectricPrices[]>;
  dateToday = new Date();

  showElPrice: boolean = false;
  elPriceVar: any;

  user: User = {
    Id: "1",
    ProductId: "1",
    UserName: "Philip",
    Password: "Passw0rd!",
    isAdmin: false
  };

  constructor(
    private data: DataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute) { }



  ngOnInit(): void {
    if (this.user.UserName == null && this.user.Password == null) {
      this.router.navigate(['/login'])
    }
    this.lightLogs$ = this.data.getCustomerLightLogs(this.user.ProductId)
      .pipe(
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

  //electric prices
  createElPrice(lightlog: any) {
    var elPriceAPI;
    let endDate = new Date(lightlog.dateSent);

    this.elPrices$ = this.data.getElecPrices(endDate);
    this.elPrices$.subscribe(
      (response: ElectricPrices[]) => {
        elPriceAPI = response.at(endDate.getHours());
        //chatgpt
        if (elPriceAPI && typeof elPriceAPI.DKK_per_kWh === 'number' && !isNaN(elPriceAPI.DKK_per_kWh)) {
          // Your calculations involving elPriceAPI.DKK_per_kWh
          let lightHoursUp = lightlog.hours + (lightlog.minutes / 60) + (lightlog.seconds / 60 / 60);

          // calc to KWH 
          let lightKWH = 40 * lightHoursUp / 1000;

          //øre
          let priceForSesh = (lightKWH * elPriceAPI.DKK_per_kWh) * 100;
          console.log(priceForSesh);
          this.elPriceVar = priceForSesh.toFixed(2);
        } else {
          console.error("elPriceAPI is undefined or DKK_per_kWh is not a valid number");
          // Handle the case where elPriceAPI is undefined or DKK_per_kWh is not a valid number
        }
      },
      (error) => {
        console.error(error);
        // Handle errors here
      }
    );
    this.showElPrice = true;
  }

}
