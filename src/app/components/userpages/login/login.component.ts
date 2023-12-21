import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DataService } from '../../../services/data.service';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { UserdataService } from '../../../services/userdata.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = <User>{};
  loginResult: any;
  userResult: User = {
    id: null,
    productId: "",
    userName: null,
    password: null,
    isAdmin: null,
  };


  constructor(
    private messageService: MessageService, 
    private dataService: DataService,
    private router: Router,
    private userDataService: UserdataService) {
  }
  ngOnInit(): void {
    
  }

  showSuccess() {
    this.messageService.add({
      severity: "success",
      summary: "User Logged in!",
      detail: "User has succesfully logged in"
    });

  }
  showError(errorMessage: string) {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: errorMessage
    });
  }
  
  onSubmit(loginForm: any) {
    this.user.userName = loginForm.UserName;
    this.user.password = loginForm.Password;
    this.dataService.login(this.user).subscribe(result => {
      
      this.userResult = {
        id: result.id,
        productId: result.productId,
        userName: result.userName,
        password: result.password,
        isAdmin: result.isAdmin
      };
      this.userDataService.setUser(this.userResult);
      console.log(this.userResult)

      if(this.userResult.isAdmin == true){
        this.router.navigate(['/adminlogs'])
      }
      else if(this.userResult.isAdmin == false){
        this.router.navigate(['/customerlogs'])
      }
      this.showSuccess();
    }, (error) =>{
      console.error('something went wong', error)
      this.showError("Wrong Credentials Try again");
    });
  }
}


