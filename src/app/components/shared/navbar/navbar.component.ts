import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MenubarModule } from 'primeng/menubar';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule, MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavBar implements OnInit {

  isTrue: boolean = false; // Or set it to true/false based on your logic
  @Input() componentTitle: string = "";
  @Input() user: User = {
    id: null,
    productId: "",
    userName: null,
    password: null,
    isAdmin: null
  };

    constructor(private router: Router) { }
    ngOnInit(): void {
    console.log("fromnavbar")
    console.log(this.user)
  }

    


    Logout() {
    this.router.navigate([''])
    }

    CreateUser() {
      this.router.navigate(['/createuser'])
      }
}
