// handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
         console.log('push-notification: ' + e.alert);
         navigator.notification.alert(e.alert);
    }

    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }

    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}
            
// handle GCM notifications for Android
function onNotificationGCM (event) {
    switch (event.event) {
      case 'registered':
        if (event.regid.length > 0) {
            console.log('REGISTERED -> REGID:' + event.regid);
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            console.log("regID = " + event.regid);
          return fn({
            'type': 'registration',
            'id': event.regid,
            'device': 'android'
          });
        }
        break;

      case 'message':
          // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if (event.foreground) {
            console.log('INLINE NOTIFICATION');
          var my_media = new Media("/android_asset/www/" + event.soundname);
          my_media.play();
        } else {
          if (event.coldstart) {
              console.log('COLDSTART NOTIFICATION');
          } else {
              console.log('BACKGROUND NOTIFICATION');
          }
        }

            navigator.notification.alert(event.payload.message);
            console.log('MESSAGE -> MSG: ' + event.payload.message);
               //Only works for GCM
           console.log('MESSAGE -> MSGCNT: ' + event.payload.msgcnt);
           //Only works on Amazon Fire OS
           console.log('MESSAGE -> TIME: ' + event.payload.timeStamp);
        break;

      case 'error':
          console.log('ERROR -> MSG:' + event.msg);
        break;

      default:
          console.log('EVENT -> Unknown, an event was received and we do not know what it is');
        break;
    }
  }