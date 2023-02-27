import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomeView from "./pages/home-view/HomeView";
import { Topbar } from "./topbar/Topbar";
import Sidebar from "./sidebar/Sidebar";
import StoresView from "./pages/stores/StoresView";
import SingleStoreView from "./pages/stores/components/SingleStoreView";
import styles from  "./app.module.scss"
import Loading from "../loading/Loading";
import EmployeesView from "./pages/employees/EmployeesView";
import EmployeeOnboardView from "./pages/employees/onboarding/EmployeeOnboardView";
import useCompany, { CompanyContext, businessUID } from "../../hooks/useCompany";
import { companyContext } from "../../hooks/useCompany";
import MyBusinessView from "./pages/mybusiness/MyBusinessView";
import useProfile, { profileContext } from "../../hooks/useProfile";
import { User } from "firebase/auth";
import SingleEmployeeView from "./pages/employees/single-employee/SingleEmployeeView";

interface AppProps {
  user: User
}

function AutimaApp(props: AppProps) {
  const [view, setView] = useState(<Loading/>)
  useEffect(() => {
    props.user.getIdTokenResult(true).then(v => {
      if (v.claims.isBusinessAccount === true) {
        setView(<AdminApp user={props.user} />)
      } else {
        setView(<EmployeeApp user={props.user}/>)
      }
    })
  },[])
  return (
    <>
      {
         view
      }
    </>
  );


}
const TopbarSafezone = () => {
    return <div className={styles.topbarSafezone} />
}

interface EmployeeAppProps {
  user: User,
}

const EmployeeApp = (props: EmployeeAppProps) => {
  const profile = useProfile(props.user)
  
  


  return (
    <profileContext.Provider value={profile}>
      <div>
        <button onClick={e => { e.preventDefault(); profile.setAsBusinessAccount() }}>CONVERT TO BUSINESS ACCOUNT</button>
        {
          profile.invites.map((v, i) => (
            <button key={i} onClick={()=> profile.joinCompany(v)}>Join {v.companyId}</button>
          ))
        }
      </div>
    </profileContext.Provider>
  )
}
interface AdminAppProps {
  user: User
}



const AdminApp = (props: AdminAppProps) => {
  let appWindow = useRef() as  React.MutableRefObject<HTMLInputElement>;
  const [scrollState, setScrollState] = useState<number>(0);
  useEffect(() => {
    appWindow.current.addEventListener("scroll", () => {
      setScrollState(appWindow.current.scrollTop);
    });
  });

  const company: CompanyContext = useCompany(businessUID(props.user.uid))

  return (
    <companyContext.Provider value={company}><Sidebar /><div ref={appWindow} className={styles.managerApp}>
      <div
        className={styles.topbarContainer}
        style={scrollState > 5
          ? {
            background: "white",
            boxShadow: "0px 0px 2px 0px gray",
            transition: "all 300ms ease",
          }
          : {}}
      >
        <Topbar />
      </div>
      <TopbarSafezone />
      <Routes>
        <Route path="*" element={<HomeView />} />
        <Route path={"/stores"}>
          <Route path={":storeId"} element={<SingleStoreView />} />
          <Route path={""} element={<StoresView />} />
        </Route>
        <Route path={"/payroll"}>
        </Route>
        <Route path={"/employees"}>
          <Route path={""} element={<EmployeesView />}/>
          <Route path={"onboard"} element={<EmployeeOnboardView />} />
          <Route path={":uid"} element={<SingleEmployeeView />}/>
        </Route>
        <Route path={"/messages"}/>
        <Route path={"/tasks"}/>
        <Route path={"/mybusiness"} element={<MyBusinessView />} />
        <Route path={"/support"} element={<TestElement/>}/>
      </Routes>
    </div>
    </companyContext.Provider>
  )
}

type AddressResult = {
  addressLines: string[]
  administrativeArea: string
  languageCode: string
  locality: string
  postalCode: string
  regionCode: string
}

const useAddressValidation = () => {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<AddressResult>()

  

  function validate() {
    const body = {
      address: {
        regionCode: "CA",
        addressLines: [input]
      }
    }

    fetch("https://addressvalidation.googleapis.com/v1:validateAddress?key=AIzaSyDQQOEb_WD7RJFrqiC_oKXAJlV36oZUSKQ", {
      method: "POST",
      body: JSON.stringify(body)
    }).then(v => {
      v.json().then(v => {
        console.log(v.result.address.postalAddress as AddressResult)
        setResult(v as AddressResult)
      })
    })
  }
  return {input, setInput, result, validate}
}

const TestElement = () => {
  const address = useAddressValidation()
  return (
    <form onSubmit={(e) => { e.preventDefault(); address.validate() }}>
      <input value={address.input} onChange={e => {address.setInput(e.currentTarget.value)}}  />
      <div>{`${address.result}`}</div>
    </form>
  )
}

export default AutimaApp;
