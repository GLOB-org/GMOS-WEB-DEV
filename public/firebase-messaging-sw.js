importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

firebase.initializeApp({
    messagingSenderId: "1000116117931"
})

const messagingFCM = firebase.messaging()

messaging.setBackgroundMessageHandler(payload => {
    console.log(payload)
    console.log('background message')
    // const title = payload.notification.title;
    // console.log('payload', payload.notification.icon);
    // console.log(payload)
    // const options = {
    //     body: payload.notification.body,
    //     icon: payload.notification.icon
    // }
    // return self.registration.showNotification(title, options);
})

