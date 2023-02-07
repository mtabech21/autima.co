import React, { useContext, useEffect, useRef } from "react";
import "../employee-availabilities.scss";
import { dayContext } from "./AvailabilitiesDay";

function SelectableInterval({ selected, id, children }) {
  const day = useContext(dayContext);
  const ref = useRef();
  const handleMouseDown = () => {
    day.setInitial(id);
  };
  const handleHover = (e) => {
    if (e.buttons === 1) {
      day.setHovered(id);
    }
  };
  useEffect(() => {
    ref.current.addEventListener("mousedown", handleMouseDown);
    ref.current.addEventListener("mouseenter", handleHover);
  });
  return (
    <div
      ref={ref}
      className={`selectable-interval ${selected && "selected-interval"} ${
        day.selected[0] === id && "first-selected"
      } ${day.selected[day.selected.length - 1] === id && "last-selected"}`}
    >
      {children}
    </div>
  );
}

export default SelectableInterval;
