import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBM0yOS7HxvMUsiprjCk4wNa9yHov9zUmE",
    authDomain: "chats-c0969.firebaseapp.com",
    databaseURL: "https://chats-c0969.firebaseio.com",
    projectId: "chats-c0969",
    storageBucket: "chats-c0969.appspot.com",
    messagingSenderId: "100923964328",
    appId: "1:100923964328:web:93bba65b46016ae6adfb9d",
    measurementId: "G-5ZSMFPZRL9"
};

if (!firebase.apps.length) {
    var firebaseApp = firebase.initializeApp(firebaseConfig)
}

const db = firebaseApp.firestore()

export default db
