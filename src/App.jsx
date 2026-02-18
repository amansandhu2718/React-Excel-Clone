import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "./Components/REDUX/Features/AuthSlice";

import "./App.css";
import PageActionContainer from "./Components/PageActionContainer/PageActionContainer";
import CellPropsActionContainer from "./Components/CellPropsActionContainer/CellPropsActionContainer";
import FormulaActionContainer from "./Components/FormulaActionContainer/FormulaActionContainer";
import SheetContainer from "./Components/SheetContainer/SheetContainer";
import VirtualGridContainer from "./Components/VirtualizedGrid/VirtualizedGrid";
import SignInPage from "./Components/SignInPage/SignInPage";
import { CircularProgress, Box } from "@mui/material";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser({ email: firebaseUser.email, uid: firebaseUser.uid }));
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={!user ? <SignInPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={
            user ? (
              <>
                <PageActionContainer />
                <CellPropsActionContainer />
                <FormulaActionContainer />
                <div style={{ height: "calc(100vh - 10.5rem)" }}>
                  <VirtualGridContainer />
                </div>
                <SheetContainer />
              </>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
