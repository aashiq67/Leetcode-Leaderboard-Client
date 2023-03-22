import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import axios from 'axios';
import { Button } from '@mui/material';
import Form from './Form';

import DeleteIcon from '@mui/icons-material/Delete';

export default function BasicTable() {

    const [users, setUsers] = useState([]);
    const [rows, setRows] = useState([]);
    const [ques, setQues] = useState(new Map());

    const [displayForm, setDisplayForm] = useState(false);

    const updateProblems = async () => {
        try {
            const response = await axios.get("http://localhost:5000/update-problems");
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/getallusers");
            console.log(response);
            setUsers(response.data.users)
        } catch (error) {
            console.log(error);
        }

    }

    const getAllData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/getalldata");
            const data = response.data.data;

            var users = [];
            const newMap = new Map();
            data.forEach((user) => {
                const username = user.username;
                Object.keys(user.progress).forEach((date) => {
                    newMap.set(username, user.progress[date][0].ques);
                    setQues(newMap);
                    const solved = user.progress[date][0].solved;
                    if (users[date] === undefined)
                        users[date] = [{ username: username, solved: solved }]
                    else
                        users[date].push({ username: username, solved: solved });
                })
            })
            setQues(newMap);
            setRows(users);
        } catch (error) {
            console.log(error);
        }
    }

    const Refresh = () => {
        updateProblems();
        getAllUsers();
        getAllData();
    }

    useEffect(() => {
        Refresh();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            Refresh();
        }, 1000 * 60 * 60 * 24);
        return () => clearInterval(interval);
    })

    const deleteUser = async (username) => {
        try {
            const reply = prompt("type the username to delete the user");
            if (reply === username) {
                const response = await axios.post("http://localhost:5000/deleteuser", { username });
                console.log(response);
                Refresh();
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Button style={{ margin: '1rem auto', display: "flex" }} variant='contained' onClick={() => setDisplayForm(!displayForm)}>Add User</Button>
            {displayForm && <Form setDisplayForm={setDisplayForm} Refresh={Refresh} />}
            <TableContainer component={Paper}>

                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid black' }} align="center">Date</TableCell>
                            {users.map((user) =>
                                <TableCell sx={{ border: '1px solid black' }} align="center">
                                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                                        {user.username} <DeleteIcon onClick={() => deleteUser(user.username)} />
                                    </span>
                                    <Table sx={{ width: '50%', margin: 'auto' }}>
                                        <TableBody>
                                            <TableRow align="center">
                                                {console.log("logging=", ques.get(user.username))}
                                                <TableCell sx={{ color: 'green' }}>{ques.get(user.username)[0]}</TableCell>
                                                <TableCell sx={{ color: 'orange' }}>{ques.get(user.username)[1]}</TableCell>
                                                <TableCell sx={{ color: 'red' }}>{ques.get(user.username)[2]}</TableCell>
                                                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>{ques.get(user.username)[3]}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(rows).map((date) => (

                            <TableRow
                                key={date}
                            >
                                <TableCell component="th" scope="row" align="center" sx={{ border: '1px solid black' }}>
                                    {date}
                                </TableCell>
                                {rows[date].map((obj) =>
                                    <TableCell align="center" sx={{ border: '1px solid black' }}>{obj.solved}</TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
