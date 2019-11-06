import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform } from "@ionic/angular";
import {
  LocalNotifications,
  ELocalNotificationTriggerUnit
} from "@ionic-native/local-notifications/ngx";

const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  constructor(private platform: Platform, private localNotifications: LocalNotifications) {
    SplashScreen.hide().catch(err => {
      console.warn(err);
    });
    
    SplashScreen.hide().catch((err) => {
      console.warn(err);
    });

    if (this.platform.is("capacitor")) {
      this.localNotifications.isScheduled(1).then(scheduled => {
        if(!scheduled) {
          let firstNotificationTime = new Date();
          firstNotificationTime.setHours(firstNotificationTime.getHours() + 24);

          this.localNotifications.schedule({
            id: 1,
            title: "Snapaday",
            text: "Have you taken your snap today?",
            trigger: {
              at: firstNotificationTime,
              every: ELocalNotificationTriggerUnit.DAY
            }
          });
        }
      });
    }
  }

}
