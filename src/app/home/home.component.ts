import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataURL = 'https://api.spaceXdata.com/v3/launches?limit=100';
  spaceData: any = [];
  errorMessage = '';
  year = [];


  isYearClicked: any;
  isLaunchClicked: boolean;
  isLandingClicked: boolean;

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    for (let i = 2006; i <= 2020; i++) {
      this.year.push(i.toString());
    }
    this.generateUrl(this.dataURL);
  }

  getData(url) {
    this.httpService.getData(url).subscribe(
      (response: any) => {
        for (const data of response) {
          const singleData = {
            flight_number: data.flight_number,
            mission_name: data.mission_name,
            mission_id: data.mission_id,
            launch_year: data.launch_year,
            launch_success: data.launch_success,
            land_success: data.rocket.first_stage.cores[0].land_success,
            mission_patch_small: data.links.mission_patch
          };
          if (singleData.land_success == null) {
            singleData.land_success = 'NA';
          }
          if (singleData.launch_success == null) {
            singleData.launch_success = 'NA';
          }
          this.spaceData.push(singleData);
        }
      },
      (error) => {
        this.errorMessage = error;
      });
  }

  clickedYear(i) {
    if (this.isYearClicked === this.year[i]) {
      this.isYearClicked = undefined;
    } else {
      this.isYearClicked = this.year[i];
    }
    this.generateUrl(this.dataURL);
  }

  clickedLaunch(value) {
    if (this.isLaunchClicked === value) {
      this.isLaunchClicked = undefined;
    } else {
      this.isLaunchClicked = value;
    }
    this.generateUrl(this.dataURL);
  }

  clickedLanding(value) {
    if (this.isLandingClicked === value) {
      this.isLandingClicked = undefined;
    } else {
      this.isLandingClicked = value;
    }
    this.generateUrl(this.dataURL);
  }

  generateUrl(url) {
    this.spaceData = [];
    let filter = '';

    if (this.isYearClicked !== undefined) {
      filter += '&launch_year=' + this.isYearClicked;
    }

    if (this.isLaunchClicked !== undefined) {
      filter += '&launch_success=' + this.isLaunchClicked;
    }
    if (this.isLandingClicked !== undefined) {
      filter += '&land_success=' + this.isLandingClicked;
    }
    url += filter;
    this.getData(url);
  }
}
