import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DataService } from '../../../services/data.service';
import { User } from '../../../models/user.model';
import { error } from 'console';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = <User>{};
  constructor(private messageService: MessageService, private dataService: DataService) {
  }
  loginResult: any;
  ngOnInit(): void {
    
  }

  showSuccess() {
    this.messageService.add({
      severity: "success",
      summary: "User Created!",
      detail: "The user was created successfully!"
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
    this.user.UserName = loginForm.UserName;
    this.user.Password = loginForm.Password;
    
    this.loginResult = this.dataService.login(this.user).subscribe(result => {
      console.log(this.loginResult);
      console.log(result.UserName);
      this.loginResult = result;
      
      this.showSuccess();
    }, (error) =>{
      console.error('something went wong')
      this.showError("Wrong Credentials Try again");
    });
  }
}


