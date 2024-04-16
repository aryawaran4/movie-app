import { Component } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showNavbar = true;
  userLogin = false

  constructor(private globalService: GlobalService){

  }

  ngOnInit() {
    const token = this.globalService.getToken()
    if (token) {
      this.userLogin = true
    } else {
      this.userLogin = false
    }
    console.log(this.userLogin);
    
  }
}
