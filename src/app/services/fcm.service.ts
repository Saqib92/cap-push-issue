import { Injectable, NgZone } from '@angular/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
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
      console.log('notification ' + JSON.stringify(notification));
      this.zone.run(() => {
        this.notifications.push(notification);
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        console.log('new notif action', action);
      }
    );
  }

  getToken() {
    if (Capacitor.getPlatform() !== 'web') {
      PushNotifications.requestPermissions().then((permission) => {
        console.log(permission)
        if (permission.receive == "granted") {
          // Register with Apple / Google to receive push via APNS/FCM
          FCM.getToken().then((result) => {
            console.log('token from get token', result)
            this.remoteToken = result.token;
          }).catch((err) => console.log(err));
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