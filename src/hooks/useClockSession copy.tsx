import {
  get,
  off,
  onChildChanged,
  onChildRemoved,
  onValue,
  push,
  ref,
  update,
} from "firebase/database";
import { doc, runTransaction, setDoc } from "firebase/firestore";
import { useState, useEffect, useCallback, useMemo } from "react";
import { liveDb, db } from "../App";

/**Use current state of user activity.
 * @parameter Session
 *
 * @returns List of active users.
 */
export const useClockSession = (session) => {
  const [handlingSelection, setHandlingSelection] = useState<string| null>(null);
  const [users, setUsers] = useState();
  const [activeUsers, setActiveUsers] = useState([]);
  const activeRef = useMemo(
    () => ref(liveDb, `${session.companyId}/${session.branchId}/active/`),
    [session]
  );
  const handleSubmit = useCallback(
    (type) => {
      const uploadSession = (data) => {
        runTransaction(db, () => {
          const date = new Date();
          Object.keys(data).forEach((user) => {
            const userData = data[user];
            console.log("uploading: " + user + "...");
            const newData = {};
            newData["logs"] = [];
            Object.keys(userData).forEach((action) => {
              newData["logs"].push(userData[action]);
            });
            setDoc(
              doc(
                db,
                `companies/${session.companyId}/branches/${session.branchId}/employees/${user}/timecards/${session.sessionId}`
              ),
              newData
            );
            setDoc(
              doc(
                db,
                `companies/${session.companyId}/branches/${session.branchId}/employees/${user}`
              ),
              {
                latestReload: date.toLocaleString(),
              }
            );
          });
        })
          .then(() => console.log())
          .catch((err) => console.log(err.code));
      };

      const logUser = async (userId, type) => {
        const uid = users[userId];
        const time = new Date();
        console.log(users);
        const user = {
          branch: ref(liveDb, `${session.companyId}/${session.branchId}/`),
          meta: ref(
            liveDb,
            `${session.companyId}/${session.branchId}/users/${uid}`
          ),
          active: ref(
            liveDb,
            `${session.companyId}/${session.branchId}/active/${uid}`
          ),
          timecard: ref(
            liveDb,
            `${session.companyId}/${session.branchId}/sessions/${session.sessionId}/${uid}`
          ),
          session: ref(
            liveDb,
            `${session.companyId}/${session.branchId}/sessions/${session.sessionId}`
          ),
        };
        const newCard = push(user.timecard).key;
        const clockStamp = time.toLocaleTimeString(["en-US"], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const timestamp = time.getTime();
        const initialize = () => {
          const updates = {};
          updates[`/active/${uid}`] = true;
          update(user.branch, updates);
        };
        const clockIn = () => {
          const updates = {};
          updates[`/active/${uid}`] = "active";
          updates[`/sessions/${session.sessionId}/${uid}/${newCard}`] = {
            timestamp: timestamp,
            time: clockStamp,
            type: "CLOCK_IN",
          };
          update(user.branch, updates);
        };
        const clockOutMeal = () => {
          const updates = {};
          updates[`/active/${uid}`] = "break_meal";
          updates[`/sessions/${session.sessionId}/${uid}/${newCard}`] = {
            timestamp: timestamp,
            time: clockStamp,
            type: "CLOCK_OUT_MEAL",
          };
          update(user.branch, updates);
        };
        const clockOut = () => {
          const updates = {};
          updates[`/active/${uid}`] = "inactive";
          updates[`/sessions/${session.sessionId}/${uid}/${newCard}`] = {
            timestamp: timestamp,
            time: clockStamp,
            type: "CLOCK_OUT_END",
          };
          update(user.branch, updates);
          get(activeRef).then((snap) => {
            let users = snap.val();
            console.log(users);
            if (Object.values(users).every((value) => value === "inactive")) {
              get(user.session).then((snap) => {
                uploadSession(snap.val());
              });
              let updates = {};
              Object.keys(users).forEach((key) => {
                updates[key] = null;
              });
              update(activeRef, updates);
            }
          });
        };
        initialize();
        const updates = {};
        updates["latestActivity"] = clockStamp;
        switch (type) {
          case "IN":
            update(user.meta, updates);
            return clockIn();
          case "OUT_MEAL":
            update(user.meta, updates);
            return clockOutMeal();
          case "OUT":
            update(user.meta, updates);
            return clockOut();
          default:
            console.log("ID not in use");
        }
      };
      logUser(handlingSelection, type);
      setHandlingSelection(null);
    },
    [session, handlingSelection, users, activeRef]
  );
  const loadIds = useCallback(
    () =>
      get(ref(liveDb, `${session.companyId}/${session.branchId}/ids`)).then(
        (snap) => {
          setUsers(snap.val());
        }
      ),
    [session]
  );
  onChildRemoved(activeRef, (snap) => {
    console.log(snap)
    setActiveUsers(null);
  });
  onChildChanged(activeRef, async (child, prevChild) => {
    console.log(prevChild)
    setActiveUsers((prev) => {
      let update = { ...prev };
      update[child.key] = child.val();
      return update;
    });
  });
  useEffect(() => {
    loadIds();
    onValue(
      activeRef,
      (snapshot) => {
        off(activeRef);
        setActiveUsers(snapshot.val());
      },
      {
        onlyOnce: true,
      }
    );
  }, [activeRef, loadIds]);
  return { activeUsers, handleSubmit, setHandlingSelection, handlingSelection };
};
