import React, { CSSProperties, useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill, RiUser2Fill } from "react-icons/ri";
import "../auth-page.scss";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db } from "../../../App";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [rePasswordValue, setRePasswordValue] = useState("");
  const [fnValue, setFnValue] = useState("");
  const [lnValue, setLnValue] = useState("");
  //const [phoneValue, setPhoneValue] = useState("");
  const [mainMessage, setMainMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [styleEmail, setStyleEmail] = useState<CSSProperties>();
  const [styleRePass, setStyleRePass] = useState<CSSProperties>();
  const [stylePass, setStylePass] = useState<CSSProperties>();
  const errorStyle = { outline: "solid rgb(255,0,0,0.5) 3px" };

  let [goodEmail, setGoodEmail] = useState(false);
  const openForm = (e: any) => {
    e.preventDefault()
    setErrorMessage(null);
    setStyleRePass({});
    setStyleEmail({});
    setStylePass({});

    fetchSignInMethodsForEmail(auth, emailValue)
      .then((res) => {
        if (res.length === 0) {
          setGoodEmail(true);
          setMainMessage("Enter your information");
        } else {
          setStyleEmail(errorStyle);
          setErrorMessage("This email is already in use.");
        }
      })
      .catch((err) => {
        if (emailValue.length === 0) {
          setErrorMessage("Please enter your email.");
        } else if (err.code === "auth/invalid-email") {
          setStyleEmail(errorStyle);
          setErrorMessage("Not a valid email");
        } else {
          console.log(err.code);
        }
      });
  };
  const register = async (e: any) => {
    e.preventDefault();
    setErrorMessage(null);
    setStyleRePass({});
    setStyleEmail({});
    setStylePass({});
    if (passwordValue === rePasswordValue) {
      try {
        await createUserWithEmailAndPassword(auth, emailValue, passwordValue);
        let user = auth.currentUser;
        let info = {
          firstName: fnValue,
          lastName: lnValue,
        };
        let privateInfo = {
          emailAdress: emailValue,
        };
        
        await setDoc(doc(db, "profiles", user!.uid), info);
        await setDoc(
          doc(db, "profiles", user!.uid, "private", "info"),
          privateInfo
        );
        

        navigate("/home");
      } catch (error: any) {
        if (error.code === "auth/internal-error") {
          setErrorMessage("Please complete the form.");
        } else if (error.code === "auth/email-already-in-use") {
          setErrorMessage("Email already in use.");
          setStyleEmail(errorStyle);
        } else if (error.code === "auth/weak-password") {
          setErrorMessage("Password is too weak (minimum 8 characters)");
          setStylePass(errorStyle);
        } else if (error.code === "auth/invalid-email") {
          setErrorMessage("Please use valid email.");
          setStyleEmail(errorStyle);
        } else {
          setErrorMessage(error.code);
        }
      }
    } else {
      setErrorMessage("Password doesn't match.");
      setStyleRePass(errorStyle);
    }
  };

  return (
    <>
      <form onSubmit={goodEmail ? register : openForm}>
        <h2 style={{ textAlign: "center" }}>{mainMessage}</h2>
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
        {!goodEmail ? (
          <div className={"auth-form"}>
            <div className={"auth-input"}>
              <div className="auth-icon">
                <MdAlternateEmail />
              </div>
              <input
                style={styleEmail}
                autoComplete="false"
                value={emailValue}
                onChange={(e) => {
                  setEmailValue(e.currentTarget.value);
                }}
                type="text"
                placeholder="Email"
              ></input>
            </div>
          </div>
        ) : (
          <div className={"auth-form"}>
            <div className="auth-form-row">
              <div className={"auth-input"}>
                {" "}
                {/*FIRST NAME*/}
                <div className="auth-icon">
                  <RiUser2Fill />
                </div>
                <input
                  autoComplete="false"
                  value={fnValue}
                  onChange={(e) => {
                    setFnValue(e.currentTarget.value);
                  }}
                  type="text"
                  placeholder="First Name"
                ></input>
              </div>
              <div className={"auth-input"}>
                {" "}
                {/*LAST NAME*/}
                <input
                  style={stylePass}
                  autoComplete="false"
                  value={lnValue}
                  onChange={(e) => {
                    setLnValue(e.currentTarget.value);
                  }}
                  type="text"
                  placeholder="Last Name"
                ></input>
              </div>
            </div>
            <div className={"auth-input"}>
              {/*EMAIL*/}
              <div className="auth-icon">
                <MdAlternateEmail />
              </div>
              <input
                style={styleEmail}
                autoComplete="off"
                value={emailValue}
                onChange={(e) => {
                  setEmailValue(e.currentTarget.value);
                }}
                type="text"
                placeholder="Email"
              ></input>
            </div>
            <div className="auth-form-row">
              <div className={"auth-input"}>
                <div className="auth-icon">
                  <RiLockPasswordFill />
                </div>
                <input
                  style={stylePass}
                  autoComplete="false"
                  value={passwordValue}
                  onChange={(e) => {
                    setPasswordValue(e.currentTarget.value);
                  }}
                  type="password"
                  placeholder="Password"
                ></input>
              </div>
              <div className={"auth-input"}>
                {/*RE-PASSWORD*/}
                <input
                  style={styleRePass}
                  autoComplete="false"
                  value={rePasswordValue}
                  onChange={(e) => {
                    setRePasswordValue(e.currentTarget.value);
                  }}
                  type="password"
                  placeholder="Confirm Password"
                ></input>
              </div>
            </div>
          </div>
        )}
        <div className={"auth-btn"}>
          <button className={"button"}>Create account</button>
        </div>
      </form>
      <div className={"auth-create"}>
        Already have an account?
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          Log In
        </button>
      </div>
    </>
  );
}

export default Register;
