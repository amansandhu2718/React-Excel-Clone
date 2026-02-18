import React, { useState } from "react";
import img from "./login.svg"
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading } from "../REDUX/Features/AuthSlice";
import {
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

const SignInPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleAuth = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleGoogleSignIn = async () => {
    dispatch(setLoading(true));
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleTabChange = (event, newValue) => {
    setIsLogin(newValue === 0);
    dispatch(setError(null));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #188038 0%, #0d4d22 100%)",
        p: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={24}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: 6,
            overflow: "hidden",
            minHeight: { md: "600px" },
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Left Side: Illustration */}
          <Box
            sx={{
              flex: 1,
              background: "#f0fdf4",
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              p: 6,
            }}
          >
            <Box
              component="img"
              src={img}
              alt="Login Illustration"
              sx={{
                width: "100%",
                maxWidth: "450px",
                filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.1))",
              }}
            />
          </Box>

          {/* Right Side: Form */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 4, sm: 6, md: 8 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box sx={{ mb: 4, textAlign: { xs: "center", md: "left" } }}>
              <Typography
                variant="h3"
                fontWeight="800"
                color="#188038"
                gutterBottom
                sx={{ letterSpacing: "-0.5px" }}
              >
                Excel Clone
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ opacity: 0.8 }}>
                {isLogin ? "Welcome back!" : "Join us today!"}
              </Typography>
            </Box>

            <Tabs
              value={isLogin ? 0 : 1}
              onChange={handleTabChange}
              sx={{
                mb: 4,
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  backgroundColor: "#188038",
                },
                "& .MuiTab-root": {
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "text.secondary",
                  "&.Mui-selected": {
                    color: "#188038",
                  },
                },
              }}
            >
              <Tab label="Log In" />
              <Tab label="Sign Up" />
            </Tabs>

            <Box component="form" onSubmit={handleAuth} sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                // autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AiOutlineMail size={22} color="#188038" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AiOutlineLock size={22} color="#188038" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
              />

              {error && (
                <Alert
                  severity="error"
                  sx={{ mt: 2, borderRadius: 2, alignItems: "center" }}
                >
                  {error}
                </Alert>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 4,
                  py: 1.8,
                  borderRadius: 2,
                  backgroundColor: "#188038",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  boxShadow: "0 4px 14px 0 rgba(24,128,56,0.39)",
                  "&:hover": {
                    backgroundColor: "#0d4d22",
                    boxShadow: "0 6px 20px rgba(13,77,34,0.23)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={26} color="inherit" />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  my: 3,
                  "&::before, &::after": {
                    content: '""',
                    flex: 1,
                    borderBottom: "1px solid #eee",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ px: 2, fontWeight: 500 }}
                >
                  OR
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleGoogleSignIn}
                disabled={loading}
                startIcon={<FcGoogle size={24} />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  color: "#3c4043",
                  borderColor: "#dadce0",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#d2e3fc",
                    backgroundColor: "rgba(66,133,244,0.04)",
                  },
                }}
              >
                Continue with Google
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignInPage;
