import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FcmService } from './services/fcm.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    public fcm: FcmService,
    private platform: Platform,
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.getPlatform() !== 'web') { // to call it on non web platforms
          this.fcm.getToken();
      } else {
        console.log('no mobile');
      };
    });
  }

}
