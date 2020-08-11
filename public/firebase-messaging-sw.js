importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

firebase.initializeApp({
    messagingSenderId: "1000116117931"
})

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(payload => {
    console.log(payload)
    console.log('background message')
    // const notificationTitle = 'Background Message Title';
    // // const notificationOptions = {
    // //     body: 'Background Message body.',
    // //     icon: '/firebase-logo.png'
    // // };
    // const notificationOptions = {
    //     body: 'Background Message body.',
    //     icon: '/firebase-logo.png'
    // };

    // return self.registration.showNotification(notificationTitle,
    //     notificationOptions);

})
