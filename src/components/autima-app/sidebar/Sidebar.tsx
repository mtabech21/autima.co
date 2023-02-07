import React from "react";
import logo from "../../../assets/logo_white.svg";
import {
  IoHome,
  IoCash,
  IoPeople,
  IoDocument,
  IoSettings,
  IoLogOutOutline,
  IoMailOutline,
  IoCalendarOutline,
  IoHelpCircleOutline,
  IoPersonCircleOutline,
  IoAlbums,
  IoAlbumsOutline,
} from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../App";
import "./sidebar.scss";

function Sidebar() {
  let navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const currentLocation = pathname.split("/");
  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error: any) {
      console.log(error.message);
    } finally {
      window.location.reload();
    }
  };
  return (
    <div className={"sidebar"}>
      <div className={"sidebar-container"}>
        <div className={"sidebar-logo-container"}>
          {" "}
          {/*LOGO*/}
          <div className={"sidebar-logo"}>
            <img src={logo} alt="logo_white"></img>
          </div>
        </div>
        <div className={"navigation-container"}>
          <div className={"nav-to-cont"}>
            {/*HOME*/}
            <div
              className={"nav-to home-nav"}
              onClick={() => {
                navigate("/");
              }}
            >
              <IoHome className={"icon"} />
              <div>Home</div>
              <MdArrowForwardIos className={"icon"} />
            </div>
            {/*STORES*/}
            <div
              className={
                currentLocation[1] === "stores"
                  ? "nav-to active-nav-to"
                  : "nav-to"
              }
              onClick={() => {
                navigate("/stores");
              }}
            >
              <IoAlbumsOutline className={"icon"} />
              <div>Stores</div>
            </div>
            {/*SCHEDULE*/}
            <div
              className={
                currentLocation[1] === "schedule"
                  ? "nav-to active-nav-to"
                  : "nav-to"
              }
              onClick={() => {
                navigate("/schedule");
              }}
            >
              <IoCalendarOutline className={"icon"} />
              <div>Schedule</div>
            </div>
            {/*EMPLOYEES*/}
            <div
              className={
                currentLocation[1] === "employees"
                  ? "nav-to active-nav-to"
                  : "nav-to"
              }
              onClick={() => {
                navigate("/employees");
              }}
            >
              <IoPeople className={"icon"} />
              <div>Employees</div>
            </div>
            {/*MAIL*/}
            <div
              className={
                currentLocation[1] === "mail"
                  ? "nav-to active-nav-to"
                  : "nav-to"
              }
              onClick={() => {
                navigate("/mail");
              }}
            >
              <IoMailOutline className={"icon"} />
              <div>Messages</div>
            </div>
            {/*PAYROLL*/}
            <div
              className={
                currentLocation[1] === "payroll"
                  ? "nav-to active-nav-to"
                  : "nav-to"
              }
              onClick={() => {
                navigate("/payroll");
              }}
            >
              <IoCash className={"icon"} />
              <div>Payroll</div>
            </div>
            {/*REPORTS*/}

            <div
              className={
                currentLocation[1] === "reports"
                  ? "nav-to active-nav-to"
                  : "nav-to"
              }
              onClick={() => {
                navigate("/reports");
              }}
            >
              <IoDocument className={"icon"} />
              <div>Reports</div>
            </div>
            {/*ACCOUNT*/}
            <div
              className={
                currentLocation[1] === "account"
                  ? "nav-to active-nav-to"
                  : "nav-to"
              }
              onClick={() => {
                navigate("/account");
              }}
            >
              <IoPersonCircleOutline className={"icon"} />
              <div>Account</div>
            </div>
            {/*SETTINGS*/}
            <div
              className={
                currentLocation[1] === "settings"
                  ? "nav-to active-nav-to"
                  : "nav-to"
              }
              onClick={() => {
                navigate("/settings");
              }}
            >
              <IoSettings className={"icon"} />
              <div>Settings</div>
            </div>
            {/*SUPPORT*/}
            <div
              className={
                currentLocation[1] === "support"
                  ? "nav-to active-nav-to"
                  : "nav-to"
              }
              onClick={() => {
                navigate("/support");
              }}
            >
              <IoHelpCircleOutline className={"icon"} />
              <div>Support</div>
            </div>
          </div>
        </div>
        <div className={"sidebar-footer"}>
          <div
            className={"div-nav"}
            onClick={() => {
              console.log("you found the secret button");
            }}
          ></div>
          <div className={"logout-container"}>
            <div className={"logout"} onClick={logout}>
              <IoLogOutOutline className={"icon"} />
              <div>Sign out</div>
            </div>
          </div>
          <div>Copyright © 2022 Mete Solutions</div>
          <div>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;