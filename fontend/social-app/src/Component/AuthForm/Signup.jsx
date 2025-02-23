import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Alert,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
} from "@mui/material";
import { useState, useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";

const Signup = ({ setIsLogin }) => {
    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const { register, loading, error } = useContext(AuthContext);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSignup = async () => {
        const response = await register(inputs);
        if (response.status === 201) {
            setIsLogin(true);
        }
    }

    return (
        <Stack spacing={2} width="100%">
            <TextField
                label="Email"
                variant="outlined"
                size="small"
                name="email"
                required
                value={inputs.email}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                label="First Name"
                variant="outlined"
                size="small"
                name="firstName"
                required
                value={inputs.firstName}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                label="Last Name"
                variant="outlined"
                size="small"
                name="lastName"
                required
                value={inputs.lastName}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                label="Password"
                variant="outlined"
                size="small"
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={inputs.password}
                onChange={handleChange}
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {error && <Alert severity="error">{error.message}</Alert>}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="small"
                onClick={handleSignup}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>
        </Stack>
    );
};

export default Signup;
