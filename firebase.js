const firebase = require('firebase-admin');

const FIREBASE_CREDENTIAL = process.env.FIREBASE_CREDENTIAL;

firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(FIREBASE_CREDENTIAL)),
    databaseURL: 'https://for-demo-purposes-only.firebaseio.com'
});

module.exports = firebase;
