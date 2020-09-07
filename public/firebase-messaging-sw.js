importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

firebase.initializeApp({
    // messagingSenderId: "1000116117931"

    apiKey: "AIzaSyD3ONndJma3pdNlQgHCKH36TsjEhKRrKl0",
    authDomain: "gcm-marketplace.firebaseapp.com",
    databaseURL: "https://gcm-marketplace.firebaseio.com",
    projectId: "gcm-marketplace",
    storageBucket: "gcm-marketplace.appspot.com",
    messagingSenderId: "1000116117931",
    appId: "1:1000116117931:web:f0ca5b8be109a18415b2ee",
    measurementId: "G-M6K5VF4SZG"
})

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(payload => {
    // console.log(payload)
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
