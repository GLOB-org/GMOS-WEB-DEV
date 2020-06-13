import firebase from 'firebase/app';
import 'firebase/storage';

try {
    // var firebaseConfig = {
    //     apiKey: "AIzaSyD3YPzaX1WGaLInLXTv0EDe3mIlVzE7xZE",
    //     authDomain: "gcmuser-58249.firebaseapp.com",
    //     databaseURL: "https://gcmuser-58249.firebaseio.com",
    //     projectId: "gcmuser-58249",
    //     storageBucket: "gcmuser-58249.appspot.com",
    //     messagingSenderId: "149830645075",
    //     appId: "1:149830645075:web:0ad75a3c1a5c774e041da6",
    //     measurementId: "G-KN0YYDBXVT"
    // };
    var firebaseConfig = {
        apiKey: "AIzaSyD3ONndJma3pdNlQgHCKH36TsjEhKRrKl0",
        authDomain: "gcm-marketplace.firebaseapp.com",
        databaseURL: "https://gcm-marketplace.firebaseio.com",
        projectId: "gcm-marketplace",
        storageBucket: "gcm-marketplace.appspot.com",
        messagingSenderId: "1000116117931",
        appId: "1:1000116117931:web:f0ca5b8be109a18415b2ee",
        measurementId: "G-M6K5VF4SZG"
    };
} catch (err) {
    console.log("errore");
    console.log(err);
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

const storage = firebase.storage();

export {
    storage,
    firebase as
    default
}
