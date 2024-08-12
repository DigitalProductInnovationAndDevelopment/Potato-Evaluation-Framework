import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { Link as RouterLink } from 'react-router-dom';

export default function Sidebar ({ isAdmin })  {
    return (<React.Fragment>
        <ListItemButton component={RouterLink} to={'/'}>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItemButton>
        {isAdmin && (
            <ListItemButton component={RouterLink} to="/admin-panel">
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Admin Panel" />
            </ListItemButton>
        )}
        <ListItemButton component={RouterLink} to={'/how-to'}>
            <ListItemIcon>
                <SlideshowIcon />
            </ListItemIcon>
            <ListItemText primary="How To" />
        </ListItemButton>
    </React.Fragment>
    )
};
