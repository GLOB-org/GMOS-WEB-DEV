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
    // console.log('[firebase-messaging-sw.js] Received background message ', payload);
    self.clients.matchAll({
        includeUncontrolled: true
    }).then(function (clients) {
        clients.forEach(function (client) {
            client.postMessage(payload);
        })
    })

    if (payload.data["firebase-messaging-msg-data"]) {
        var key_notif = payload.data["firebase-messaging-msg-data"].key
    } else {
        var key_notif = payload.data.key
    }

    var body_notif = ""
    if (key_notif == "nego_seller") {
        body_notif = 'Ada balasan nego dari penjual'
    } else if (key_notif == "nego_approved_seller" || key_notif == "nego_approved_buyer") {
        body_notif = '1 Negosiasi berhasil disepakati'
    } 
    else {
        body_notif = "Notifikasi"
    }
    
    // else if (key_notif == "transaksi"){
    //     body_notif = 'Ada transaksi baru'
    // } 

    const notificationTitle = 'GLOB';
    const notificationOptions = {
        body: body_notif,
        click_action: 'https://glob.co.id/transaksi/nego',
        icon: 'https://glob.co.id/images/icon-glob.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});

// messaging.setBackgroundMessageHandler(payload => {
//     // console.log(payload)
//     console.log('background message reload')
//     location.reload()
//     // const notificationTitle = 'Background Message Title';
//     // // const notificationOptions = {
//     // //     body: 'Background Message body.',
//     // //     icon: '/firebase-logo.png'
//     // // };
//     // const notificationOptions = {
//     //     body: 'Background Message body.',
//     //     icon: '/firebase-logo.png'
//     // };

//     // return self.registration.showNotification(notificationTitle,
//     //     notificationOptions);

// })
