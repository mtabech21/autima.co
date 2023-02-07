import { useState, useEffect } from "react";
import { Auth, User, onAuthStateChanged } from "firebase/auth";
import { DocumentData, Firestore, doc, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

const useAuth = (auth: Auth, db: Firestore) => {
  const [data, setData] = useState<DocumentData | null>();
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Update Authorisation State
    onAuthStateChanged(auth, async (currUser) => {
      if (currUser) {
        // User Authenticated ?
        try {
          // Get data from database
          const docRef = doc(db, "profiles", currUser.uid);
          const docSnap = await getDoc(docRef);
          // Update app data
          setData(docSnap.data());
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
        setData(null);
        setUser(null);
        setLoading(false);
      }
    });
  }, [db, auth]);
  return [data, user, loading];
};

export default useAuth;
