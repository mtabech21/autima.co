import React, { createContext, useContext, useEffect, useState } from "react";
import "../employee-availabilities.scss";
import { AvailabilitiesContext } from "../EmployeeAvailabilities";
import { useSelection } from "../functions";
import SelectableInterval from "./SelectableInterval";

export const dayContext = createContext();

function AvailabilitiesDay({ day }) {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const data = useContext(AvailabilitiesContext);
  const [setInitial, setHovered, setSelected, selected] = useSelection();
  const selectablePerDay = (data.maxInterval[1] - data.maxInterval[0]) * 4;
  useEffect(() => {
    setFrom(() => {
      const update = new Date();
      update.setHours(data.maxInterval[0], 15 * selected[0], 0);
      return update;
    });
    setTo(() => {
      const update = new Date();
      update.setHours(
        data.maxInterval[0],
        15 * (selected[selected.length - 1] + 1),
        0
      );
      return update;
    });
  }, [data.maxInterval, selected]);
  const Time = ({ i }) => {
    return selected[0] === i
      ? from && (
          <pre className="time-on-board tob-t">
            {from.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </pre>
        )
      : selected[selected.length - 1] === i
      ? to && (
          <pre className="time-on-board tob-b">
            {to.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </pre>
        )
      : null;
  };
  return (
    <dayContext.Provider value={{ setInitial, setHovered, selected, data }}>
      <div className="availabilities-day">
        <div style={{ padding: "10px" }}>
          <div>
            {day === 0
              ? "SUNDAY"
              : day === 1
              ? "MONDAY"
              : day === 2
              ? "TUESDAY"
              : day === 3
              ? "WEDNESDAY"
              : day === 4
              ? "THURSDAY"
              : day === 5
              ? "FRIDAY"
              : day === 6
              ? "SATURDAY"
              : null}
          </div>
          <div style={{ fontSize: "40px", fontWeight: "600" }}>
            {day === 0
              ? "21"
              : day === 1
              ? "22"
              : day === 2
              ? "23"
              : day === 3
              ? "24"
              : day === 4
              ? "25"
              : day === 5
              ? "26"
              : day === 6
              ? "27"
              : null}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <button
            className="reset-button-day"
            onClick={() => {
              setSelected([]);
              setHovered();
              setInitial();
            }}
          >
            RESET
          </button>
          <button
            className="selectall-button-day"
            onClick={() => {
              setInitial(0);
              setHovered(selectablePerDay - 1);
            }}
          >
            ALL DAY
          </button>
        </div>
        {[...Array(selectablePerDay)].map((v, i) => (
          <SelectableInterval selected={selected.includes(i)} id={i} key={i}>
            <Time i={i} />
          </SelectableInterval>
        ))}
      </div>
    </dayContext.Provider>
  );
}

export default AvailabilitiesDay;
