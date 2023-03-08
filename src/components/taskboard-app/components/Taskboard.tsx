import React, {createContext, useState, useContext, useEffect} from "react";
import style from "../clockapp.module.scss"
import { IoAlertCircleOutline, IoCheckbox, IoLayers, IoLayersOutline, IoPerson, IoTimeOutline } from "react-icons/io5";
import { taskboardContext } from "../TaskboardApp";
import { Task } from "../../../au-types";

const filterContext = createContext<any>({})

function Taskboard() {
  const [filter, setFilter] = useState("All");
  const taskboard = useContext(taskboardContext)
  const [selectedTask, setSelectedTask] = useState(taskboard.tasks[0])
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
          <div className={style.taskListContainer}>
            <div className={style.filterTop}>{filter}</div>
            <div className={style.taskList}>
              {
                taskboard.tasks.map((task,i) => (
                  <SingleTask task={task} key={i} onClick={() => setSelectedTask(task)}/>
                ))
              }
            </div>
          </div>
        </div>
        <div>
          {JSON.stringify(selectedTask)}
        </div>
      </div>
    </div>
  );
}

interface Props {
  children: JSX.Element
  name: string
}
interface SingleTaskProp {
  task: Task,
  onClick: () => void
}
function SingleTask(props: SingleTaskProp) {
  const tb = useContext(taskboardContext)
  const [showAssignedTo, setShowAssignedTo] = useState(false)

  return (
    <div className={style.singleTask} onClick={props.onClick}>
      <div style={{width: ".5em", background: "green"}}/>
      <div style={{padding: "1em", width: "100%"}}>
        <div style={{fontWeight: "bold"}}>{props.task.title}</div>
        <div>By {props.task.dateDue.toDate().toLocaleDateString()}</div>
      </div>
      <div style={{ color: "gray", fontFamily: "monospace", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {props.task.assignedTo &&
          <IoPerson style={{ fontSize: "1.2em", margin: "1em" }} onMouseEnter={() => setShowAssignedTo(true)} onMouseLeave={() => setShowAssignedTo(false)} />
        }
        {showAssignedTo && <div className={style.assignedTo}>
          {props.task.assignedTo?.map(v => (
            v
          ))}
        </div>}
      </div>
      
    </div>
  )
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



export default Taskboard;
