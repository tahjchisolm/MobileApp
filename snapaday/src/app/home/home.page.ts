import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { ModalController, AlertController, LoadingController, IonList } from "@ionic/angular";
import { PhotoService } from "../services/photo.service";
import { SimpleAlertService } from '../services/simple-alert.service';
import { SlideshowPage } from "../slideshow/slideshow.page";

import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { prepareOverlay } from '@ionic/core/dist/types/utils/overlays';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  @ViewChild(IonList, { static : false }) slidingList: IonList;

  constructor(
    private simpleAlert: SimpleAlertService,
    public photoService: PhotoService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private socialSharing: SocialSharing,
    private loadingCtrl: LoadingController,
    public sanitizer: DomSanitizer
    ) {}

  ngOnInit() {
    this.photoService.load();
  }

  takePhoto(): void {
    this.loadingCtrl
      .create({
        message: "Saving Photo..."
      })
      .then(overlay => {
        overlay.present();

        this.photoService.takePhoto().then(
          photo => {
            overlay.dismiss();

            this.alertCtrl
              .create({
                header: "Nice one!",
                message: "You've taken your photo for today, would you also like to share it?",
                buttons: [
                  {
                    text: "Share",
                    handler: () => {
                      console.log(photo);
                      this.socialSharing.share(
                        "I'm taking a selfie every day with #Snapaday",
                        null,
                        photo,
                        null
                      );
                    }
                  }
                ]
              })
              .then(prompt => {
                prompt.present();
              });
          },
          err => {
            overlay.dismiss();
            this.simpleAlert.createAlert("Oops!", err).then(alert => {
              alert.present();
            });
          }
        );
      });
  }

  playSlideshow(): void {
    if (this.photoService.photos.length > 1) {
      this.modalCtrl
        .create({
          component: SlideshowPage
        })
        .then(modal => {
          modal.present();
        });
    } else {
      this.simpleAlert
        .createAlert("Oops", "You need at least two photos before you can play a slideshow.")
        .then(alert => {
          alert.present();
        });
    }
  }

  deletePhoto(photo): void {
    this.slidingList.closeSlidingItems().then(() => {
      this.photoService.deletePhoto(photo);
    });
  }

}
