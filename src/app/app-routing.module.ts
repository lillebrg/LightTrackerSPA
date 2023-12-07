import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/loglists/admin/admin.component';
import { CreateuserComponent } from './components/userpages/createuser/createuser.component';
import { LoginComponent } from './components/userpages/login/login.component';


const routes: Routes = [
  {path: '', component: AdminComponent},
  {path: 'createuser', component: CreateuserComponent},
  {path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
