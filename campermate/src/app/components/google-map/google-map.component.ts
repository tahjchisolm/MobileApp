import { Component, Input, Renderer2, ElementRef, Inject } from '@angular/core';
import { Platform } from "@ionic/angular";
import { DOCUMENT } from "@angular/common";
import { Plugins } from "@capacitor/core";

const { Geolocation, Network } = Plugins;

declare var google;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent {
  @Input("apiKey") apiKey: string;

  public map: any;
  public marker: any;
  public firstLoadFailed: boolean = false;
  private mapsLoaded: boolean = false;
  private networkHandler = null;
  public connectionAvailable = true;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private platform: Platform,
    @Inject(DOCUMENT) private _document
  ) { }

  public init(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof google == "undefined") {
        this.loadSDK().then(
          res => {
            this.initMap().then(
              res => {
                this.enableMap();
                resolve(true);
              },
              err => {
                this.disableMap();
                reject(err);
              }
            );
          },
          err => {
            this.firstLoadFailed = true;
            reject(err);
          }
        );
      } else {
        reject("Google maps already initialised");
      }
    });
  }

  private loadSDK(): Promise<any> {
    this.addConnectivityListeners();

    return new Promise((resolve, reject) => {
      if (!this.mapsLoaded) {
        Network.getStatus()
        .then(
          status => {
            if (status.connected) {
              this.injectSDK().then(
                res => {
                  resolve(true);
                },
                err => {
                  reject(err);
                }
              );
            } else {
              reject("Not online");
            }
          },
          err => {
            if (navigator.onLine) {
              this.injectSDK().then(
                res => {
                  resolve(true);
                },
                err => {
                  reject(err);
                }
              );
            } else {
              reject("Not online");
            }
          }
        )
        .catch(err => {
          console.warn(err);
        });
      } else {
        reject("SDK already loaded")
      }
    });
  }

  private injectSDK(): Promise<any> {
    return new Promise((resolve, reject) => {
      window["mopInit"] = () => {
        this.mapsLoaded = true;
        resolve(true);
      };
      let script = this.renderer.createElement("script");
      script.id = "googleMaps";

      if (this.apiKey) {
        script.src = "https://maps.googleapis.com/maps/api/js?key=" + this.apiKey + "&callback=mapInit";
      } else {
        script.src = "https://maps.googleapis.com/maps/api/js?callback=mapInit";
      }

      this.renderer.appendChild(this._document.body, script);
    });
  }

  private initMap(): Promise<any> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000}).then(
        position => {
          console.log(position);

          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          let mapOptions = {
            center: latLng, 
            zoom: 15
          };

          this.map = new google.maps.Map(this.element.nativeElement, mapOptions);
          resolve(true);
        },
        err => {
          console.log(err);
          reject("Could not initialise map");
        }
      );
    });
  }

  disableMap(): void {
    this.connectionAvailable = false;
  }

  enableMap(): void {
    this.connectionAvailable = true;
  }

  addConnectivityListeners(): void {
    console.warn("The Capacitor Network API does not currently have a web implementation. This will only work when running as an iOS/Android app");

    if (this.platform.is("cordova")) {
      this.networkHandler = Network.addListener("networkStatusChange", status => {
        if (status.connected) {
          if (typeof google == "undefined" && this.firstLoadFailed) {
            this.init().then(
              res => {
                console.log("Google Maps ready.");
              },
              err => {
                console.log(err);
              }
            );
          } else {
            this.enableMap();
          }
        }
      });
    }
  }

  public changeMarker(lat:number, lng: number): void {
    let latLng = new google.maps.Latlng(lat, lng);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });

    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = marker;
  }

}
