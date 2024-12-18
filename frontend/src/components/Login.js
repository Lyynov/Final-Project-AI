import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom styling for the login button
const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#1976d2",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    textTransform: "none",
    transition: "background-color 0.3s ease",
    '&:hover': {
        backgroundColor: "#115293",
    },
}));

const Login = () => {
    const [credentials, setCredentials] = useState({ identity: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            // Call the login API
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();

            if (response.status === 200) {
                // On success, save the token and redirect
                localStorage.setItem("authToken", data.data);
                navigate("/dashboard");
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                backgroundImage: "url('https://img.freepik.com/free-vector/blue-fluid-background_53876-114597.jpg?t=st=1734452639~exp=1734456239~hmac=ac3757e8d118e5dfbc4a240a45cc7f2f9ba051b69a8e6002451e9fc0c0da5fe1&w=996')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
                    <Typography variant="h4" align="center" color="primary" gutterBottom>
                        Welcome Back
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
                        Login to access your account
                    </Typography>
                    <Box component="form" noValidate>
                        <TextField
                            fullWidth
                            placeholder="Email or Username"
                            name="identity"
                            value={credentials.identity}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            InputProps={{ style: { borderRadius: 8 } }}
                        />
                        <TextField
                            fullWidth
                            placeholder="Password"
                            name="password"
                            type="password"
                            value={credentials.password}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            InputProps={{ style: { borderRadius: 8 } }}
                        />
                        {error && (
                            <Typography color="error" align="center" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <StyledButton
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleSubmit}
                        >
                            LOGIN
                        </StyledButton>
                    </Box>
                    <Typography
                        align="center"
                        sx={{ mt: 2, color: "primary.main", cursor: "pointer" }}
                        onClick={() => navigate("/register")}
                    >
                        Don't have an account? Register here.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
