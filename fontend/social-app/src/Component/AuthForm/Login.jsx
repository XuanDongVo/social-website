import { useContext, useState } from "react";
import {
    TextField, Button, Alert, AlertTitle, CircularProgress, IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthContext } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const { login, loading, error } = useContext(AuthContext);
    const [inputs, setInputs] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const response = await login(inputs);
        if (response?.status === 200) {
            navigate("/");
        }
    };

    return (
        <>
            {/* <form  > */}
            <TextField
                label="Email"
                variant="filled"
                fullWidth
                size="small"
                name="email"
                required
                value={inputs.email}
                // autoComplete="email"
                onChange={handleChange}
            />
            <TextField
                label="Password"
                variant="filled"
                size="small"
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={inputs.password}
                onChange={handleChange}
                fullWidth
                // autoComplete="password"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}

                sx={{ mt: 2 }}
            />

            {error && (
                <Alert severity="error" sx={{ mt: 2, width: '100%', p: 0.5 }} >
                    <AlertTitle > {typeof error === "string" ? error : error.message}</AlertTitle>
                </Alert>
            )}

            <Button
                fullWidth
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 2 }}
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
            >
                {loading ? <CircularProgress size={20} /> : "Log in"}
            </Button>
            {/* </form> */}
        </>
    );
};

export default Login;
