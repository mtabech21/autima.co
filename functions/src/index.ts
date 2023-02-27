
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://autima-b165c-default-rtdb.firebaseio.com",
});

exports.setAsBusiness = functions.https.onCall((data: {
  bool: boolean
}, context) => {
  if (context.auth != null) {
    admin.auth().setCustomUserClaims(context.auth.uid, {
      isBusinessAccount: data.bool ?? false,
    });
    return {
      uid: context.auth.uid,
      app: admin.app().name,
    };
  } else {
    return "no auth";
  }
});

