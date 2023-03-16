import { useEffect, useState } from "react"


type DateSelectorOptions = {
  range?: boolean
}

function useDateSelector<T extends Date | {from: Date, to: Date}>(props: DateSelectorOptions) {
  let range = props.range ?? false
  const [selection, setSelection] = useState<T>()



  const weekdays = {
    full: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
    ],
    short: [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
    ],
    letters: [
    "S",
    "M",
    "T",
    "W",
    "T",
    "F",
    "S"
    ]
  }
  

  return {selection}
}

export default useDateSelector