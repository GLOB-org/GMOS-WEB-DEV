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
        body_notif = 'Ada balasan negosiasi dari penjual'
    } else if (key_notif == "nego_buyer_first") {
        body_notif = 'Ada negosiasi baru dari pembeli'
    } else if (key_notif == "nego_buyer") {
        body_notif = 'Ada balasan negosiasi dari pembeli'
    } else if (key_notif == "nego_approved_seller" || key_notif == "nego_approved_buyer") {
        body_notif = '1 Negosiasi berhasil disepakati'
    } else if (key_notif == 'transaksi') {
        var get_body_notif = JSON.parse(payload.data.notification)
        body_notif = get_body_notif.body
    } else {
        body_notif = "Notifikasi GLOB"
    }

    const notificationTitle = 'GLOB';
    const notificationOptions = {
        body: body_notif,
        click_action: 'https://glob.co.id/transaksi/nego',
        icon: 'https://glob.co.id/images/icon-glob.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
