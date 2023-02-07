import { useEffect, useState } from "react";

export const useSelection = () => {
  const [initial, setInitial] = useState();
  const [hovered, setHovered] = useState();
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    if (hovered < initial) {
      setSelected(() => {
        let update = [];
        for (var i = hovered; i <= initial; i++) {
          update.push(i);
        }
        return update;
      });
    } else if (hovered > initial) {
      setSelected(() => {
        let update = [];
        for (var i = initial; i <= hovered; i++) {
          update.push(i);
        }
        return update;
      });
    }
  }, [initial, hovered]);

  return [setInitial, setHovered, setSelected, selected];
};
