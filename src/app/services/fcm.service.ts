import { Injectable, NgZone } from '@angular/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class FcmService {

  notifications: PushNotificationSchema[] = [];

  remoteToken: string;

  constructor(
    private zone: NgZone
  ) {
    if (Capacitor.getPlatform() !== 'web') {
      this.pushListener();
    } else {
      console.log('no mobile');
    };
  }

  pushListener() {
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      this.zone.run(() => {
        this.notifications.push(notification);
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        console.log(action)
        if (action.notification.data.type == 'Post') {
          this.zone.run(() => {
            // Do you Stuff
          });
        }else if (action.notification.data.type == 'user') {
          this.zone.run(() => {
            // Do you Stuff
          });
        }
      }
    );
  }

  getToken() {
    if (Capacitor.getPlatform() !== 'web') {
      PushNotifications.requestPermissions().then((permission) => {
        if (permission.receive == "granted") {
          // Register with Apple / Google to receive push via APNS/FCM
          if(Capacitor.getPlatform() == 'ios'){
            PushNotifications.register().then((res)=>{
              console.log('From Regisiter Promise', res)
            })
            PushNotifications.addListener('registration', (token: Token)=>{            
              FCM.getToken().then((result) => {
                this.remoteToken = result.token;
              }).catch((err) => console.log('i am Error' , err));
            })
          }else{
            FCM.getToken().then((result) => {
              this.remoteToken = result.token;
            }).catch((err) => console.log('i am Error' , err));
          }
        } else {
          // No permission for push granted
          alert('No Permission for Notifications!')
        }
      });
    } else {
      console.log('No mobile');
    }
  }

}