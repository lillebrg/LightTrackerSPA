import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { User } from '../../../models/user.model';
import { DataService } from '../../../services/data.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs'
import { Product } from '../../../models/product.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-createuser',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.css',
  providers: [MessageService, ConfirmationService]
})
export class CreateuserComponent implements OnInit{
  //products array 
  products$!: Observable<Product[]>;
  
  //usermodel to send with http post
  user = <User>{};
  constructor(
    private data: DataService,
    private messageService: MessageService,
    private router: Router,) {
  }

  //on init 
  ngOnInit(): void {

    //populating products array with dataservice getProducts()
    this.products$ = this.data.getProducts();
  }

  //toast success
  showSuccess() {
    this.messageService.add({
      severity: "success",
      summary: "User Created!",
      detail: "The user was created successfully!"
    });

  }
  //toast error
  showError(errorMessage: string) {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: errorMessage
    });
  }

  //create user method called when the create user form is submitted
  //takes an any as parameter which is the input as properties
  createUserSubmit(userForm: any) {
    console.log(userForm);
    //username val
    if (userForm.UserName.length < 2) {
      //showing toast error
      this.showError("The User was not created! \n Username minimum length is 2 characters!");
    }
    else {
      //password val
      if (userForm.Password.length < 8) {
        this.showError("The User was not created! \n  Password minimum length is 8 characters!");;
      }
      else {

        //product
        if(userForm.ProductId == null || userForm.ProductId == ""){
          this.showError("The User was not created! \n  Choose a product");;
        }
        else{
          //to user object
          this.user.userName = userForm.UserName;
          this.user.password = userForm.Password;
          this.user.productId = userForm.ProductId;
          this.user.isAdmin = userForm.isAdmin;


          if(userForm.isAdmin === ""){
            this.user.isAdmin = false;
          }
          //calling dataservice postuser which takes in a userobject and creates it 
          this.data.postUser(this.user).subscribe(result => {
            console.log('POST request successful:', result);
            this.showSuccess();
          },
          //error handling
          (error)=> {
            console.error('Error in POST request:', error);
            this.showError("The User was not created! \n Unexpected error! try again later");
          }
          
          );
          
        }
       
      }

    }

  }

  Cancel(){
    this.router.navigate(['/adminlogs'])
  }
}
