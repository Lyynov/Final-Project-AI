import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom styling for the register button
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

const Register = () => {
    const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                setMessage("Registration successful. Please log in.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "An error occurred. Please try again.");
            }
        } catch (err) {
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                backgroundImage: "url('https://img.freepik.com/free-vector/blue-fluid-background_53876-114597.jpg?t=st=1734452639~exp=1734456239~hmac=ac3757e8d118e5dfbc4a240a45cc7f2f9ba051b69a8e6002451e9fc0c0da5fe1&w=996')",
                backgroundSize: "cover",
               
                backgroundPosition: "center",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
                <Typography variant="h4" align="center" color="primary" gutterBottom>
                    Create Account
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
                    Join us to explore more!
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
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
                />
                {message && (
                    <Typography color={message.includes("successful") ? "green" : "error"} sx={{ marginTop: "10px" }}>
                        {message}
                    </Typography>
                )}
                <StyledButton
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Register
                </StyledButton>
                <Typography
                    sx={{ marginTop: "20px", cursor: "pointer" }}
                    color="primary"
                    align="center"
                    onClick={() => navigate("/login")}
                >
                    Already have an account? Login here.
                </Typography>
            </Paper>
        </Box>
    );
};

export default Register;
