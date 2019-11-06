import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { SplashScreen, StatusBar } = Plugins;
// import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    // private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar
  ) {
    SplashScreen.hide().catch(err => { console.warn(err);
    });

    StatusBar.hide().catch(err => {console.warn(err);
    });
  }

  /*initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }*/
}
