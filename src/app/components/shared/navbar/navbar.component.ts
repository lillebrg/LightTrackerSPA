import { Component, Input } from '@angular/core';
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
export class NavBar {

    constructor(private router: Router) { }

    @Input() componentTitle: string = "";
    @Input() user: User = {
        Id: null,
        ProductId: "null",
        UserName: null,
        Password: null,
        IsAdmin: null
      };


    Logout() {
    this.router.navigate(['/login'])
    }
}
