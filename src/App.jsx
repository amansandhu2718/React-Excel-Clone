import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import img from "./Components/SignInPage/login.svg";

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #188038 0%, #0d4d22 100%)",
          color: "white",
          textAlign: "center",
          p: 3,
        }}
      >
        <Box
          component="img"
          src={img}
          alt="Loading Spreadsheet"
          sx={{
            width: { xs: "80%", md: "400px" },
            maxWidth: "100%",
            mb: 4,
            filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.2))",
            animation: "pulse 2s infinite ease-in-out",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.05)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        />
        <CircularProgress color="inherit" size={50} sx={{ mb: 2 }} />
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              letterSpacing: "1px",
              opacity: 0.9,

            }}
          >
            Excel Clone
          </Box>
          <Box sx={{
            fontSize: "0.9rem", opacity: 0.7, mt: 1, position: "absolute",
            bottom: "2rem"
          }}>
            Preparing your workspace...
          </Box>
        </Box>
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
