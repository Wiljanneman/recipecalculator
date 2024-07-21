import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ModalComponent } from './modal/modal.component';
import { PopoverComponent } from './popover/popover.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'modal', component: ModalComponent },
  { path: 'popover', component: PopoverComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
