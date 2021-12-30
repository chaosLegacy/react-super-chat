import * as functions from "firebase-functions";
import { initializeApp, firestore } from 'firebase-admin';

import Filter = require('bad-words');

initializeApp();
const db = firestore();

exports.detectEvilUsers = functions
    .region('europe-west')
    .firestore
    .document(`${process.env.REACT_APP_FIREBASE_DOC_REF}/messages/{msgId}`)
    .onCreate(async (doc, ctx) => {

        const filter = new Filter();
        const { text, uid } = doc.data();


        if (filter.isProfane(text)) {

            const cleaned = filter.clean(text);
            await doc.ref.update({ text: `🤐 I got BANNED for life for saying... ${cleaned}` });

            await db.collection(`${process.env.REACT_APP_FIREBASE_DOC_REF}/banned`).doc(uid).set({});
        }

        const userRef = db.collection(`${process.env.REACT_APP_FIREBASE_DOC_REF}/users`).doc(uid)

        const userData = (await userRef.get()).data();

        if (userData?.msgCount >= 7) {
            await db.collection(`${process.env.REACT_APP_FIREBASE_DOC_REF}/banned`).doc(uid).set({});
        } else {
            await userRef.set({ msgCount: (userData?.msgCount || 0) + 1 })
        }

    });


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
