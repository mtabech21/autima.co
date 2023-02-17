import { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { DocumentData, Firestore, doc, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { Auth } from "firebase/auth";
import admin from "firebase-admin"


const useAuth = (auth: Auth, db: Firestore) => {
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    // Update Authorisation State
    onAuthStateChanged(auth, async (currUser) => {
      if (currUser) {
        // User Authenticated ?
        currUser.providerData
        try {
          // Get data from database
          const docRef = doc(db, "profiles", currUser.uid);
          const docSnap = await getDoc(docRef);
          // Update app data
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
        } catch (err: any) {
          // Error ?
          console.log(err.code);
        } finally {
          // Confirm login status for app
          setUser(currUser);
          setLoading(false);
        }
      } else {
        // No User Authenticated ?
        // Nullify data
        setProfile(null);
        setUser(null);
        setLoading(false);
      }
    });
  }, [db, auth]);
  return { profile, user, loading };
};

export default useAuth;
