import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import axios from 'axios';

const theme = createTheme();

export default function Form(props) {
    const handleSubmit = async (event) => {
        props.setDisplayForm(false);
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get('username'),
            userprofile: data.get('userprofile'),
        });

        try {
            const response = await axios.post("http://localhost:5000/adduser", {
                username: data.get('username'),
                userprofile: data.get('userprofile')
            });
            console.log(response);
        } catch (error) {
            console.log(error);
            alert("no profile found");
        }
        props.Refresh();
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            required
                            fullWidth
                            name="userprofile"
                            label="User Profile"
                            type="string"
                            id="userprofile"
                            autoComplete="current-userprofile"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 3 }}
                        >
                            Submit
                        </Button>  
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}