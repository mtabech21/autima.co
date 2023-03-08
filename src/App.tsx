import  "./main.scss";
import React from "react";
import AutimaApp from "./components/autima-app/AutimaApp";
import AuthApp from "./components/auth-app/AuthApp";
import Loading from "./components/loading/Loading";
import TaskboardApp from "./components/taskboard-app/TaskboardApp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import useAuth from "./hooks/useAuth";

// Initialize database information, connections and authorisations
export const firebaseConfig = {
  apiKey: "AIzaSyBxvbn60ckCkSHLL3oIXHxA5ty5uB_AyGI",
  authDomain: "autima-b165c.firebaseapp.com",
  databaseURL: "https://autima-b165c-default-rtdb.firebaseio.com",
  projectId: "autima-b165c",
  storageBucket: "autima-b165c.appspot.com",
  messagingSenderId: "558902244037",
  appId: "1:558902244037:web:0ef739f548e6bd38e2f6ac",
  measurementId: "G-L8ZQEHNHQY",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const liveDb = getDatabase(app)
/*********************/
/**Main View*/
function App() {
  
  const current = useAuth(auth, db);
  return (
      <BrowserRouter>
        {current.loading ? (
          <Loading />
        ) : current.user ? (
          <div className="app">
          <Routes>
            {/* MAIN APP **/}
            <Route path={`*`} element={<AutimaApp user={current.user} />} />
            {/* CLOCK APP **/}
            <Route path={`taskboard`}>
              <Route
                path="*"
                element={<a href="/testKey">YOUR CLOCK</a>}
              />
                <Route path={`:storeKey`} element={<TaskboardApp user={current.user}/>} />
            </Route>
            {/* /////////**/}
          </Routes>
        </div>
        ) : (
          <AuthApp />
        )}
      </BrowserRouter>
  );
}

export default App;