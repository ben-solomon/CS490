import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
 
  City:any;
  RestaurantList = [];
  constructor(private _http: HttpClient){};
  searchRestaurants(location: string){
    this.RestaurantList = [];
    return this._http.get('http://opentable.herokuapp.com/api/restaurants?city=' + location )
        .subscribe((data: any)=>{
          console.log(data);
          for (var i = 0; i < data["restaurants"].length; i++) {
               this.RestaurantList.push(
                 {"name": data["restaurants"][i].name,
                "address": data["restaurants"][i].address,
                "area": data["restaurants"][i].area,
                "imageURL": data["restaurants"][i].image_url,
                "bookURL": data["restaurants"][i].reserve_url
              }
               )
          }
        });
  }
}
