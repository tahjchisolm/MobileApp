import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ChecklistDataService } from "./services/checklist-data.service";
const { SplashScreen, StatusBar } = Plugins;
//import { Platform } from '@ionic/angular';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
//import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private dataService: ChecklistDataService) {
    this.dataService.load();
    //private platform: Platform,
    //private splashScreen: SplashScreen,
    //private statusBar: StatusBar

    //this.initializeApp();
    SplashScreen.hide().catch(err => {
       console.warn(err);
    });
    StatusBar.hide().catch(err => { 
      console.warn(err);
    });
  }
/*
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  */
}
