import { useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSaving, setSaved } from "../Components/REDUX/Features/PersistenceSlice";
import { debounce } from "../utils/debounce";

export const usePersistence = () => {
  const dispatch = useDispatch();
  const sheetState = useSelector((state) => state.sheet);
  const isInitialMount = useRef(true);

  // Memoize the debounced save function so it doesn't get recreated on every render
  const debouncedSave = useMemo(
    () =>
      debounce((state) => {
        try {
          const serializedState = JSON.stringify(state);
          localStorage.setItem("excel_clone_state", serializedState);
          dispatch(setSaved());
        } catch (err) {
          console.error("Could not save state to localStorage:", err);
        }
      }, 1500), // Reduced to 1.5 seconds for better feel
    [dispatch]
  );

  useEffect(() => {
    // Skip saving on the very first mount (when loading initial state)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    dispatch(setSaving());
    debouncedSave(sheetState);
  }, [sheetState, debouncedSave, dispatch]);
};
