import React, { forwardRef, useCallback, useContext, useState } from "react";
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
  const update = (e: any) => {
    setInput(e.target.value);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    getId(input)
    setInput("")
  };
  const getId = (from: string) => {

    let ids = session.clock.localIds
    if (from.length > 0) {
      Object.keys(ids).forEach((v, i) => {
        console.log(v)
        if (v === from) {
          session.clock.setSelectingTypeFor(Object.values(ids).at(i))
        }
      })
    }
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
