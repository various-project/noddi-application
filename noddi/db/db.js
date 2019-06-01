import firebase from 'firebase';

var Environment = require('./environment.js')

var firebaseConfig = {
  apiKey: Environment.API_KEY,
  authDomain: Environment.AUTH_DOMAIN,
  databaseURL: Environment.DATABASE_URL,
  projectId: Environment.PROJECT_ID,
  storageBucket: Environment.STORAGE_BUCKET,
  messagingSenderId: Environment.MESSAGING_SENDER_ID,
  appId: Environment.APP_ID
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.database();
