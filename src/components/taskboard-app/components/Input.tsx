import React, { forwardRef, useCallback, useContext, useEffect, useState } from "react";
import styles from "../clockapp.module.scss"
import { taskboardContext } from "../TaskboardApp";
import { stringLength } from "@firebase/util";

interface InputType {
  duringSubmit: Function
  onInput: ()=> void
}

const Input = forwardRef((props, ref: React.ForwardedRef<HTMLInputElement>) => {
  const session = useContext(taskboardContext)
  const [input, setInput] = useState("");
  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const handleSubmit = async (e: any) => {
    if (e != null) {
      e.preventDefault();
    }
    handle(input)
    setInput("")
  };
  
  const handle = (from: string) => {
    const employee = session.employees.find((employee, i) => from == employee.localId)
    if (employee !== undefined) {
      session.clock.setSelectingTypeFor(employee.uid)
    } else {
      console.log("no employee found")
    }

    // let ids = session.clock.localIds
    // if (from.length > 0) {
    //   Object.keys(ids).forEach((v, i) => {
    //     if (v === from) {
    //       session.clock.setSelectingTypeFor(Object.values(ids).at(i))
    //     }
    //   })
    // }
}



  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          marginBottom: "5px",
          fontFamily: "monospace",
          fontSize: "20px",
          fontWeight: "800",
        }}
      >
        USER ID
      </div>
      <input
        className={styles.userInput}
        ref={ref}
        value={input}
        maxLength={7}
        onChange={update}
        type="text"
        placeholder="[C]"
      ></input>
    </form>
  );
});

export default Input;
