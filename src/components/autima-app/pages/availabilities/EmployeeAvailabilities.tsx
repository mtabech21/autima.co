import React, { createContext } from "react";
import AvailabilitiesDay from "./components/AvailabilitiesDay";
import "./employee-availabilities.scss";

export const AvailabilitiesContext = createContext();
function EmployeeAvailabilities() {
  const data = {
    maxInterval: [8, 22],
    dailyInterval: {
      0: [9, 18],
      1: [9, 19],
      2: [9, 19],
      3: [9, 22],
      4: [9, 22],
      5: [9, 22],
      6: [8, 18],
    },
  };
  return (
    <AvailabilitiesContext.Provider value={data}>
      <div className="availabilities-app">
        <div className="availabilities-window">
          <AvailabilitiesDay day={0} />
          <AvailabilitiesDay day={1} />
          <AvailabilitiesDay day={2} />
          <AvailabilitiesDay day={3} />
          <AvailabilitiesDay day={4} />
          <AvailabilitiesDay day={5} />
          <AvailabilitiesDay day={6} />
        </div>
      </div>
    </AvailabilitiesContext.Provider>
  );
}

export default EmployeeAvailabilities;
