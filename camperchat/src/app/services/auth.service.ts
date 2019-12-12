import { Injectable, NgZone } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Facebook } from "@ionic-native/facebook/ngx";
import { User } from "../interfaces/user";

import { BehaviorSubject } from "rxjs";
import firebase from "@firebase/app";
import "@firebase/auth";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public loggedIn: BehaviorSubject<boolean> = new
    BehaviorSubject<boolean>(false);
  public user: User;

  constructor(
    private platform: Platform, private zone: NgZone, private facebook: Facebook) { }
  init(): void {
    // The Firebase configuration   
    const firebaseConfig = {
      apiKey: "***GOING TO REPLACE****",
      authDomain: "***GOING TO REPLACE****",
      databaseURL: "***GOING TO REPLACE****",
      projectId: "***GOING TO REPLACE****",
      storageBucket: "",
      messagingSenderId: "***GOING TO REPLACE****",
      appId: "***GOING TO REPLACE****"
    };

    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(firebaseUser => {
      this.zone.run(() => {
        if (firebaseUser) {
          this.user = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            displayPicture: firebaseUser.photoURL
          };
          this.loggedIn.next(true);
        } else {
          this.user = null;
          this.loggedIn.next(false);
        }
      });
    });
  }
  login(): void {
    if (this.platform.is("capacitor")) {
      this.nativeFacebookAuth();
    } else {
      this.browserFacebookAuth();
    }
  }

  async logout(): Promise<void> {
    if (this.platform.is("capacitor")) {
      try {
        await this.facebook.logout();
        await firebase.auth().signOut();
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await firebase.auth().signOut();
      } catch (err) {
        console.log(err);
      }
    }
  }


  async nativeFacebookAuth(): Promise<void> {
    try {
      const response = await this.facebook.login(["public_profile", "email"]);
      console.log(response);
      if (response.authResponse) {


        const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
          unsubscribe();

          if (!this.isUserEqual(response.authResponse, firebaseUser)) {

            const credential = firebase.auth.FacebookAuthProvider.credential(
              response.authResponse.accessToken
            );

            firebase
              .auth()
              .signInWithCredential(credential)
              .catch(error => {
                console.log(error);
              });
          } else {
            console.log("already signed in");
          }
        });
      } else {

        firebase.auth().signOut();
      }
    } catch (err) {
      console.log(err);
    }
  }


  async browserFacebookAuth(): Promise<void> {
    const provider = new firebase.auth.FacebookAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }

  isUserEqual(facebookAuthResponse, firebaseUser): boolean {
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      providerData.forEach(data => {
        if (
          data.providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
          data.uid === facebookAuthResponse.userID
        ) {
          return true;
        }
      });
    }
    return false;

  }
}