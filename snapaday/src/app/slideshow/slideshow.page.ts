import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { ModalController } from "@ionic/angular";
import { PhotoService } from "../services/photo.service";

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.page.html',
  styleUrls: ['./slideshow.page.scss'],
})
export class SlideshowPage implements OnInit {
  private imagePlayerInterval: any;
  public imageSrc: SafeResourceUrl;

  constructor(
    private photoService: PhotoService,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.playPhotos();
  }

  playPhotos(): void {
    let i = 0;

    // clear any interval already set
    clearInterval(this.imagePlayerInterval);

    // restart
    this.imagePlayerInterval = setInterval(() => {
      if (i < this.photoService.photos.length) {
        this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(this.photoService.photos[i].page)
        i++;
      } else {
        clearInterval(this.imagePlayerInterval);
      }
    }, 500);
  }

  close(): void {
    this.modalCtrl.dismiss();
  }
}
