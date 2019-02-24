import { Component, NgModule, ElementRef, ViewChild } from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import { Language } from './language'
import { HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  langFrom: string;
  langTo: string;
  translation: string;
  @ViewChild('translateText') translateText: ElementRef;
  constructor(private _http: HttpClient) {}
  languages = [
    new Language('en', 'english'),
    new Language('es', 'spanish'),
    new Language('zh', 'chinese'),
    new Language('ru', 'russian')

  ];

  translate (txt:string) {
    this._http.jsonp(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190223T090247Z.8bc4055d52f498ad.42bad24ba85752ce63d458cf2ee8d4a9cf274069&text=${txt}&lang=${this.langFrom}-${this.langTo}`, 'callback')
    .subscribe((data: any) => {
      // get text value out of HTTP response JSON element
        this.translation = data['text'][0];
    });
  }

}
