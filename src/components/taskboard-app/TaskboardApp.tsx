import style from "./clockapp.module.scss";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClockView from "./components/ClockView";
import Taskboard from "./components/Taskboard";
import Topmenu from "./components/Topmenu";
import Bottommenu from "./components/Bottommenu";
import  tbLogo from "../../assets/tb_logo_black.svg"
import useTaskboard from "../../hooks/useTaskboard";
import { TaskboardSession } from "../../au-types";
import { StoreInfo, businessUID } from "../../hooks/useCompany";
import { User } from "firebase/auth";
import Loading from "../loading/Loading";
import { doc, getDoc } from "firebase/firestore";
import {db} from "../../App"
import { IoArrowBack, IoScanOutline } from "react-icons/io5";

export const taskboardContext = createContext<TaskboardSession>({} as TaskboardSession)

interface TaskboardAppProps {
  user: User
}

function TaskboardApp(props: TaskboardAppProps) {
  const [store, setStore] = useState<StoreInfo>()
  let { storeKey } = useParams()
  useEffect(() => {
    getStore().then(res => {
      setStore(res)
    })
    document.body.requestFullscreen().catch(() => {
    })
  }, [])

  const getStore: () => Promise<StoreInfo> = async () => {
    let result = {} as StoreInfo
    let snap = await getDoc(doc(db, "stores", storeKey!))
    if (snap.exists()) {
      let store = snap.data() as StoreInfo
      store.storeId = snap.id
      return store
    } else {
      snap = await getDoc(doc(db, "companies", storeKey!))
      if (snap.exists()) {
        return {
          companyId: snap.id,
          storeId: snap.id,
          branchId: snap.data().companyName,
          cityName: snap.data().cityName,
        } as StoreInfo
      }
    }
    return result
  }



  return (
    store ?
    (
      <TBApp store={store}/>
    )
      :
    (
      <Loading/>
    )
  );
}



function TBApp(props: { store: StoreInfo }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const taskboard = useTaskboard(props.store)
  const nav = useNavigate()
  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.exitFullscreen();
    };
  }, []);
  return (
    <taskboardContext.Provider value={taskboard}>
      <div style={{maxHeight: "100vh",width: "100vw", display: "flex", padding: '1em', gap: "1em" , flexDirection: "column"}}>
        <div className={style.tbTop}>
          <BackButton action={() => {nav("/")}}/>
          <img style={{ minHeight: "2em", height: "100%" }} src={tbLogo} />
          <FullScreenButton screenState={isFullscreen} />
      </div>
      <div className={style.appWindow}>
    <ClockView />
    <div style={{ display: "flex", width: "75%", flexDirection: "column", gap: "1em" }}>
      <Topmenu />
      <Taskboard />
      <Bottommenu />
    </div>
    </div>
      </div>
    </taskboardContext.Provider>
  );
}

interface BBProp {
  action: ()=>void
}
function BackButton(props: BBProp) {
  return (
    <button className={style.navButton} onClick={props.action}>
      <IoArrowBack />
    </button>
  );
}

interface FSBProp {
  screenState: boolean
}
function FullScreenButton(props: FSBProp) {
  

  return (
    <button
      className={style.navButton}
      onClick={() => {
        !props.screenState
          ? document.body.requestFullscreen()
          : document.exitFullscreen();
      }}
    >
      <IoScanOutline />
    </button>
  );
}

{/* <taskboardContext.Provider value={taskboard}>
    <div style={{ width: "100%", display: "flex", padding: '1em', gap: "1em" }}>
    <ClockView />
    <div style={{ display: "flex", width: "75%", flexDirection: "column", gap: "1em" }}>
      <div className={style.tbLogo}>
        <img style={{ height: "3em" }} src={tbLogo} />
        <div style={{ border: "1px solid black" }} onClick={() => {taskboard.clock.publish()}}>ALPHA v0.0.1.1</div>
      </div>
      <Topmenu />
      <Taskboard />
      <Bottommenu />
    </div>
    </div>
    </taskboardContext.Provider> */}

export default TaskboardApp;
