import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Grid,
    Box,
    Card,
    CardContent,
    Button,
    TextField,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    CssBaseline, CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import UploadIcon from "@mui/icons-material/UploadFile";
import ChatIcon from "@mui/icons-material/Chat";

import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { jwtDecode } from "jwt-decode";



const UploadButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: "white",
    marginTop: "10px",
    "&:hover": {
        backgroundColor: theme.palette.primary.dark,
    },
}));

function Dashboard() {
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [username, setUsername] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login"); // Redirect to login
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:8080/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setResponse(res.data.answer);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleChat = async () => {
        try {
            const res = await axios.post("http://localhost:8080/chat", { query });
            setResponse(res.data.answer);
        } catch (error) {
            console.error("Error querying chat:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setTimeout(() => navigate("/login"), 2000);
        } else {
            const decoded = jwtDecode(token);
            setUsername(decoded.username);

            setIsLoading(false);
        }

    }, []);

    // Sidebar content
   

    if (isLoading) {
        return <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // Full screen height
            }}
        >
            <CircularProgress />
        </Box>
    }

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            {/* Header */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { sm: "none" }, mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <PersonIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">{username}</Typography>
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                            sx={{ ml: 2 }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            
          

            {/* Main Content */}
            <Box
            component="main"
            sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",   
                alignItems: "center",       
                minHeight: "100vh",        
                backgroundImage: "url('https://img.freepik.com/free-vector/blue-fluid-background_53876-114597.jpg?t=st=1734452639~exp=1734456239~hmac=ac3757e8d118e5dfbc4a240a45cc7f2f9ba051b69a8e6002451e9fc0c0da5fe1&w=996')",
                marginTop: "64px",
            }}
             >
                <Toolbar />
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {/* File Upload Section */}
                        <Grid item xs={12} md={6}>
                            <Card sx={{ boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Upload Data File
                                    </Typography>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        style={{ marginBottom: "10px" }}
                                    />
                                    <UploadButton
                                        onClick={handleUpload}
                                        variant="contained"
                                        fullWidth
                                        startIcon={<UploadIcon />}
                                    >
                                        Upload and Analyze
                                    </UploadButton>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Chat Section */}
                        <Grid item xs={12} md={6}>
                            <Card sx={{ boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Ask a Question
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Type your question"
                                        variant="outlined"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        style={{ marginBottom: "10px" }}
                                    />
                                    <UploadButton
                                        onClick={handleChat}
                                        variant="contained"
                                        fullWidth
                                        startIcon={<ChatIcon />}
                                    >
                                        Chat
                                    </UploadButton>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Response Section */}
                        <Grid item xs={12}>
                            <Card sx={{ boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Response
                                    </Typography>
                                    <Box
                                        sx={{
                                            backgroundColor: "#f9f9f9",
                                            padding: "10px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                            minHeight: "100px",
                                        }}
                                    >
                                        <Typography>{response || "Your response will appear here."}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}

export default Dashboard;
