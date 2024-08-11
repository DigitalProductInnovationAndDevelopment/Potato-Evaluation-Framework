import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AdminView() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    id: '',
    email: '',
    password: '',
    isAdmin: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/adminView/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }});
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedUser({
      id: '',
      email: '',
      password: '',
      isAdmin: false,
    });
    setError('');
  };

  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSave = async () => {
    if (!validateEmail(selectedUser.email)) {
      setError('Invalid email address');
      return;
    }

    try {
      if (editMode) {
        await axios.put(`http://localhost:8080/adminView/users/${selectedUser.id}`, selectedUser, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }});
      } else {
        await axios.post('http://localhost:8080/adminView/users', selectedUser, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          }});
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser({
      id: user._id,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
    });
    setEditMode(true);
    handleOpen();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/adminView/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }});
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add User
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Is Admin</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(user)}
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            {editMode ? 'Edit User' : 'Add User'}
          </Typography>
          {error && <Typography color="error" gutterBottom>{error}</Typography>} {}
          <TextField
            label="Email"
            name="email"
            value={selectedUser.email}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={Boolean(error)}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={selectedUser.password}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Is Admin"
            name="isAdmin"
            value={selectedUser.isAdmin}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                isAdmin: e.target.value === 'true',
              })
            }
            fullWidth
            select
            SelectProps={{
              native: true,
            }}
            sx={{ marginBottom: 2 }}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </TextField>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
