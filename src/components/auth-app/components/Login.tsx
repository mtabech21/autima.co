import React, { useState } from "react";
import "../auth-page.scss";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../App";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [styleEmail, setStyleEmail] = useState({});
  const [stylePass, setStylePass] = useState({});
  const login = async (e: any) => {
    try {
      e.preventDefault();
      setStyleEmail({});
      setStylePass({});
      setErrorMessage(null);
      await signInWithEmailAndPassword(auth, emailValue, passwordValue);
      navigate("/home");
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Password incorrect.");
        setStylePass({ outline: "solid rgb(255,0,0,0.5) 3px" });
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("Email not in our system.");
        setStyleEmail({ outline: "solid rgb(255,0,0,0.5) 3px" });
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("Too many attempts. Try again later.");
        setStyleEmail({ outline: "solid rgb(255,0,0,0.5) 3px" });
        setStylePass({ outline: "solid rgb(255,0,0,0.5) 3px" });
      } else if (error.code === "auth/invalid-email") {
        setStyleEmail({ outline: "solid rgb(255,0,0,0.5) 3px" });
        setErrorMessage("Please enter a valid email adress.");
      } else if (error.code === "auth/internal-error") {
        setErrorMessage("Enter your password.");
        setStylePass({ outline: "solid rgb(255,0,0,0.5) 3px" });
      } else {
        setErrorMessage(error.code);
      }
    }
  };
  return (
    <>
      <form onSubmit={login}>
        <div className={"auth-form"}>
          <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
          <div className={"auth-input"}>
            <div className="auth-icon">
              <MdAlternateEmail />
            </div>
            <input
              style={styleEmail}
              value={emailValue}
              onChange={(e) => {
                setEmailValue(e.currentTarget.value);
              }}
              type="email"
              placeholder="Email"
            ></input>
          </div>
          <div className={"auth-input"}>
            <div className="auth-icon">
              <RiLockPasswordLine />
            </div>
            <input
              style={stylePass}
              value={passwordValue}
              onChange={(e) => {
                setPasswordValue(e.currentTarget.value);
              }}
              type="password"
              placeholder="Password"
            ></input>
          </div>
          <div className={"auth-btn"}>
            <button>Log In</button>
          </div>
        </div>
      </form>
      <div className={"auth-create"}>
        Don't have an account yet?{" "}
        <button
          onClick={() => {
            navigate("/register");
          }}
        >
          Register
        </button>
      </div>
    </>
  );
}

export default Login;
