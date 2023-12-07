import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { User } from '../../../models/user.model';
import { DataService } from '../../../services/data.service';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-createuser',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.css'
})
export class CreateuserComponent{


  // user : Observable<User>;
  user = <User>{};
  constructor(private data:DataService, private http: HttpClient){
    
  }
  
  createUserSubmit(userForm: any)
  {
    if(userForm.IsAdmin == "")
    {
      userForm.IsAdmin = false;
    }
    this.user.UserName = userForm.UserName;
    this.user.Password = userForm.Password;
    this.user.IsAdmin = userForm.IsAdmin;
    this.data.postUser(this.user);
    
    this.data.postUser(this.user).subscribe((result) =>{
      console.warn(result);
    });
    console.log(this.user);
  }
}
