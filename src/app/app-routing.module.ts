import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { GetAssistComponent } from './get-assist/get-assist.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'get-assistant', component: GetAssistComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
{ path: 'how-it-works', component: HowItWorksComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
