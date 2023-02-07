import React, {createContext, useState, useContext} from "react";
import style from "../clockapp.module.scss"
import { IoAlertCircleOutline, IoCheckbox, IoLayers, IoLayersOutline, IoTimeOutline } from "react-icons/io5";

const filterContext = createContext<any>({})

function Taskboard() {
  const [filter, setFilter] = useState("All");
  
  return (
    <div className={style.taskboard}>
      <div className={style.taskWindow}>
        <div className={style.sideSelectionMenu}>
          <filterContext.Provider value={{filter, setFilter}}>
          <div className={style.sideSelectionMenuFilters}>
            <FilterButton name="All">
              <IoLayersOutline/>
            </FilterButton>
            <FilterButton name="Unread">
              <IoAlertCircleOutline/>
            </FilterButton>
            <FilterButton name="Overdue">
              <IoTimeOutline/>
            </FilterButton>
            <FilterButton name="Completed">
              <IoCheckbox/>
            </FilterButton>
          </div>
          </filterContext.Provider>
          <div className={style.filterTop}>{filter}</div>
        </div>
        <div>

        </div>
      </div>
    </div>
  );
}

interface Props {
  children: JSX.Element
  name: string
}

function FilterButton(props: Props)  {
  const context = useContext(filterContext)


  return (
    <div className={`${style.filterBtn}`} style={(props.name == context.filter) ? { backgroundColor: "whitesmoke" } : {}} onClick={() => context.setFilter(props.name)}>
      {props.children}
      {/*<div style={{color: "gray", fontSize: ".5rem"}}>{props.name}</div>*/}
    </div>
  )
}

const topStyle = {
  position: "relative",
  backgroundColor: "rgb(20,105,185)",
  minWidth: "100%",
  minHeight: "5em",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default Taskboard;
