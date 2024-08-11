import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { Link as RouterLink } from 'react-router-dom';

export const mainListItems = (
    <React.Fragment>
        <ListItemButton component={RouterLink} to={'/'}>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/adminView">
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Admin Panel" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <SlideshowIcon />
            </ListItemIcon>
            <ListItemText primary="How To" />
        </ListItemButton>
    </React.Fragment>
);