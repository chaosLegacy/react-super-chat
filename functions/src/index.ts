import * as functions from "firebase-functions";
import { initializeApp, firestore } from 'firebase-admin';

import Filter = require('bad-words');

initializeApp();
const db = firestore();

exports.detectEvilUsers = functions
    .firestore
    .document('portfolio/superChat/messages/{msgId}')
    .onCreate(async (doc, ctx) => {

        const filter = new Filter();
        const { text, uid } = doc.data();


        if (filter.isProfane(text)) {

            const cleaned = filter.clean(text);
            await doc.ref.update({ text: `🤐 I got BANNED for life for saying... ${cleaned}` });

            await db.collection('portfolio/superChat/banned').doc(uid).set({});
        }

        const userRef = db.collection('portfolio/superChat/users').doc(uid)

        const userData = (await userRef.get()).data();

        if (userData?.msgCount >= 7) {
            await db.collection('portfolio/superChat/banned').doc(uid).set({});
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
