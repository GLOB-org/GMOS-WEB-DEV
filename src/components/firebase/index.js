// import firebase from 'firebase/app';
import firebase from 'firebase'
import 'firebase/storage';

try {
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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
//   firebase.analytics();

const storage = firebase.storage();
const db = firebase.firestore()


export {
    storage,
    db,
    firebase as
    default
}
