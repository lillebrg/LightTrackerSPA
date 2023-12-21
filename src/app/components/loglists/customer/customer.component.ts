import { Component, OnInit } from '@angular/core';
import { Observable, filter, map} from 'rxjs';
import { LightLog } from '../../../models/lightlog.model';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { User } from '../../../models/user.model';
import { NavbarcustomerComponent } from '../../shared/navbarcustomer/navbarcustomer.component';
import { ElectricPrices } from '../../../models/elecprices.model'
import { __values } from 'tslib';
import { UserdataService } from '../../../services/userdata.service';


@Component({
  selector: 'app-customer',
  standalone: true,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
  imports: [SharedModule, NavbarcustomerComponent]
})
export class CustomerComponent implements OnInit {

  lightLogs$!: Observable<LightLog[]>;
  Delete: any;
  selectedLightLogs: LightLog[] = [];
  deletedIds: number[] = [];
  sortField: string = 'dateSent';
  sortOrder: number = 1;
  overviewopener: boolean = false;
  overviewTime: string = "";
  overviewPrice: string = "";
  sendUser: any;

  //el API variables
  elPrices$!: Observable<ElectricPrices[]>;
  dateToday = new Date();

  showElPrice: boolean = false;
  elPriceVar: any;

  user: User = {
    id: null,
    productId: "",
    userName: null,
    password: null,
    isAdmin: null
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

    console.log("fromcustomercomponent")
    console.log(this.user)
    if (this.user.userName == null && this.user.password == null){
      this.router.navigate(['/'])
    }
    this.lightLogs$ = this.data.getCustomerLightLogs(this.user.productId)
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
  
  openOverview() {
    this.overviewTime = ""
    this.overviewPrice = ""
    this.overviewopener = true;
    }
  
    showOverview(daysValue: number) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison
      
      // Calculate date 7 days ago
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() - daysValue);
  
      const filteredObjects$ = this.lightLogs$.pipe(
        map(objects => {
          return objects.filter(obj => {
            const objTime = new Date(obj.dateSent);
            return objTime >= endDate && objTime <= currentDate;
          });
        })
      );
      
  
      filteredObjects$.subscribe(filteredObjects => {
        console.log(filteredObjects)
        var seconds = 0
        var minutes = 0
        var hours = 0
        filteredObjects.forEach(element => {
          seconds = parseInt(element.seconds);
          minutes += parseInt(element.minutes); 
          hours += parseInt(element.hours);
          
          if(seconds >= 60){
            seconds -= 60
            minutes += 1
          }
          if(minutes >= 60){
            minutes -= 60
            hours += 1
          }
          
        });
        
        this.createElPrice(seconds, minutes, hours, currentDate.toString())

        if(daysValue == 1){
          this.overviewTime = `Light is on: ${hours}:${minutes}:${seconds} daily`
        }
        else if(daysValue == 7)
        {
          this.overviewTime = `Light is on: ${hours}:${minutes}:${seconds} weekly`
        }
        else{
          this.overviewTime = `Light is on: ${hours}:${minutes}:${seconds} montly`
        }
      });
      
    };

  resetPage(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], {
      relativeTo: this.route
    })
  }

  openElPrice(seconds: number, minutes: number, hours: number, date: string){
    this.createElPrice(seconds, minutes, hours, date);
    this.showElPrice = true;
  }

   //electric prices
   createElPrice(seconds: number, minutes: number, hours: number, date: string) {
    var elPriceAPI;
    let endDate = new Date(date);

    this.elPrices$ = this.data.getElecPrices(endDate);
    this.elPrices$.subscribe(
      (response: ElectricPrices[]) => {
        elPriceAPI = response.at(endDate.getHours());
        //chatgpt
        if (elPriceAPI && typeof elPriceAPI.DKK_per_kWh === 'number' && !isNaN(elPriceAPI.DKK_per_kWh)) {
          // Your calculations involving elPriceAPI.DKK_per_kWh
          let lightHoursUp = hours + (minutes / 60) + (seconds / 60 / 60);

          // calc to KWH 
          let lightKWH = 40 * lightHoursUp / 1000;

          //øre
          let priceForSesh = (lightKWH * elPriceAPI.DKK_per_kWh) * 100;
          this.elPriceVar = priceForSesh.toFixed(2);
          this.overviewPrice = "Price for the light: " + priceForSesh.toFixed(2) + " øre daily";

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
    
  }

}
