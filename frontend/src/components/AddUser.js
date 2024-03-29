import React, { useEffect, useState } from "react";
import {
    TextField,
    FormControlLabel,
    Switch,
    Container,
    Button,
    FormControl,
    OutlinedInput,
    InputAdornment,
    InputLabel,
    IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import asyncToast from "../services/asyncToast";
import users from "../services/users";
import LoginAdminCheck from "./LoginAdminCheck";

export default function AddUser({ user, logout, setRoute }) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [passwordFields, setPasswordFields] = useState({
        password: "",
        showPassword: false,
    });

    useEffect(() => setRoute("/adduser"), []);

    const handleSubmit = async () => {
        const toastID = asyncToast.load("Adding User...");

        try {
            const data = {
                username,
                password: passwordFields.password,
                name,
                phone,
                isAdmin,
            };
            const res = await users.register(data);
            console.log(res);
            asyncToast.update(toastID, "success", "User Added");
            setName("");
            setUsername("");
            setPhone("");
            setPasswordFields({ ...passwordFields, password: "" });
            setIsAdmin(false);
        } catch (error) {
            asyncToast.update(toastID, "error", error.response.data);
            if (error.response.status === 401) logout();
        }
    };
    const handleClickShowPassword = () => {
        setPasswordFields({
            ...passwordFields,
            showPassword: !passwordFields.showPassword,
        });
    };
    const handleChange = (prop) => (event) => {
        setPasswordFields({ ...passwordFields, [prop]: event.target.value });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Container maxWidth="lg">
            <Typography component="h1" variant="h5">
                Add New User
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <LoginAdminCheck user={user} type="admin" />
                {user && (user.isAdmin || user.isSuperAdmin) && (
                    <form noValidate autoComplete="off">
                        <TextField
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{
                                marginTop: 3,
                            }}
                            fullWidth
                            id="fullname"
                            label="Full Name"
                            variant="outlined"
                            required
                        />
                        <TextField
                            sx={{
                                marginTop: 3,
                            }}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            fullWidth
                            id="phoneno"
                            label="Phone No"
                            variant="outlined"
                            required
                        />
                        <TextField
                            sx={{
                                marginTop: 3,
                            }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            label="Username"
                            variant="outlined"
                            required
                        />
                        <FormControl
                            sx={{
                                marginTop: 3,
                            }}
                            style={{ width: "100%" }}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-password">
                                Password
                            </InputLabel>
                            <OutlinedInput
                                value={passwordFields.password}
                                id="outlined-adornment-password"
                                type={
                                    passwordFields.showPassword
                                        ? "text"
                                        : "password"
                                }
                                onChange={handleChange("password")}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                            edge="end"
                                        >
                                            {passwordFields.showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                        <FormControlLabel
                            sx={{
                                marginTop: 3,
                            }}
                            control={
                                <Switch
                                    defaultValue={isAdmin}
                                    onChange={() => setIsAdmin(!isAdmin)}
                                />
                            }
                            label="Is Admin"
                        />

                        <br />
                        <Button
                            fullWidth
                            sx={{
                                marginTop: 3,
                            }}
                            disabled={
                                username === "" ||
                                name === "" ||
                                passwordFields.password === "" ||
                                phone === ""
                            }
                            onClick={handleSubmit}
                            variant="contained"
                        >
                            Create User
                        </Button>
                    </form>
                )}
            </Box>
        </Container>
    );
}
