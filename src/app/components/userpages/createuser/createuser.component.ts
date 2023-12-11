import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { User } from '../../../models/user.model';
import { DataService } from '../../../services/data.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AnonymousSubject } from 'rxjs/internal/Subject';
@Component({
  selector: 'app-createuser',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.css',
  providers: [MessageService, ConfirmationService]
})
export class CreateuserComponent {
  userPosted = <Boolean>{}
  // user : Observable<User>;
  user = <User>{};
  constructor(private data: DataService, private messageService: MessageService) {
  }
  anyany:any;

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
  createUserSubmit(userForm: any) {
    if (userForm.IsAdmin == "") {
      userForm.IsAdmin = false;
    }

    //username val
    if (userForm.UserName.length < 2) {
      this.showError("The User was not created! \n Username minimum length is 2 characters!");
    }
    else {
      //password val
      if (userForm.Password.length < 8) {
        this.showError("The User was not created! \n  Password minimum length is 8 characters!");;
      }
      else {
        this.user.UserName = userForm.UserName;
        this.user.Password = userForm.Password;
        this.anyany = this.data.postUser(this.user).subscribe(result => {
          console.log("this is ananyna");
          console.log(this.anyany);
          console.log("this is resuklt");
          console.log(result.UserName);
          this.anyany = result;
          if (result == null) {
            this.showError("A problem occured. The User was not created!");

          }
          else {
            this.showSuccess();
          }

        });
        console.log(this.anyany);
      }

    }

  }
}
