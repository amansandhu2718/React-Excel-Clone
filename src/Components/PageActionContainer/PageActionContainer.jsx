import styles from "./PageActionContainer.module.css";
import { Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useDispatch } from "react-redux";
import { logout } from "../REDUX/Features/AuthSlice";
import { AiOutlineLogout } from "react-icons/ai";

export default function PageActionContainer() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div className={styles.parent}>
        <div
          style={{
            paddingLeft: "10px",
            paddingRight: "30px",
            color: "white",
            fontSize: "1.8rem",
            fontFamily: "Monoton, sans-serif",
          }}
        >
          EXCEL
        </div>
        <div className={`${styles.pageAction} ${styles.pageActionActive}`}>
          Home
        </div>
        <div className={styles.pageAction}>File</div>
        <div className={styles.pageAction}>Insert</div>
        <div className={styles.pageAction}>Layout</div>
        <div className={styles.pageAction}>Help</div>

        <Box sx={{ flex: 1 }} />

        <Button
          onClick={handleLogout}
          startIcon={<AiOutlineLogout />}
          sx={{
            color: "white",
            textTransform: "none",
            mr: 2,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Sign Out
        </Button>
      </div>
    </>
  );
}

import { Box } from "@mui/material";
