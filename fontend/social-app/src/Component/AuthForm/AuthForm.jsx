import { Box, Paper, Typography, Divider, Button, Stack } from "@mui/material";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <Stack spacing={1} width="100%">
            {/* Form Container */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Stack spacing={3} alignItems="center">
                    <img src="/logo.png" alt="Instagram" height={90} style={{ cursor: "pointer" }} />

                    {isLogin ? <Login /> : <Signup setIsLogin={setIsLogin} />}

                    {/* Divider (OR) */}
                    <Stack direction="row" alignItems="center" spacing={1} width="100%">
                        <Divider sx={{ flex: 1 }} />
                        <Typography variant="body2" color="text.secondary" fontWeight="bold">
                            OR
                        </Typography>
                        <Divider sx={{ flex: 1 }} />
                    </Stack>

                    {/* <GoogleAuth prefix={isLogin ? "Log in" : "Sign up"} /> */}
                </Stack>
            </Paper>

            {/* Toggle between Login & Signup */}
            <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                <Typography variant="body2">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => setIsLogin(!isLogin)}
                        sx={{ textTransform: "none", fontWeight: "bold", ml: 1 }}
                    >
                        {isLogin ? "Sign up" : "Log in"}
                    </Button>
                </Typography>
            </Paper>
        </Stack>
    );
};

export default AuthForm;
