import React, { useState } from "react";
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
    signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading } from "../REDUX/Features/AuthSlice";
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
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
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #188038 0%, #0d4d22 100%)",
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={10}
                    sx={{
                        padding: 4,
                        borderRadius: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" color="#188038" gutterBottom>
                        Excel Clone
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mb={3}>
                        Welcome to your powerful spreadsheet companion
                    </Typography>

                    <Tabs
                        value={isLogin ? 0 : 1}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        sx={{ width: "100%", mb: 3 }}
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AiOutlineMail size={20} color="#188038" />
                                    </InputAdornment>
                                ),
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AiOutlineLock size={20} color="#188038" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: 2,
                                backgroundColor: "#188038",
                                "&:hover": {
                                    backgroundColor: "#0d4d22",
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : isLogin ? "Sign In" : "Get Started"}
                        </Button>

                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mb: 2, textAlign: "center" }}>
                            OR
                        </Typography>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            startIcon={<FcGoogle size={24} />}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                color: "#000",
                                borderColor: "#ddd",
                                "&:hover": {
                                    borderColor: "#bbb",
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                        >
                            Continue with Google
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default SignInPage;
