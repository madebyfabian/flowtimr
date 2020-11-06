export default class PushNotification {
  constructor( title ) {
    return (async () => {
      const notificationAllowed = Notification.permission === 'granted' || (await Notification.requestPermission()) === 'granted'
      if (notificationAllowed)
        new Notification(title, { body: 'In 1 min' })
      else
        console.warn('Notification was not sent, since you have disabled permission.')
    })();
  }
}