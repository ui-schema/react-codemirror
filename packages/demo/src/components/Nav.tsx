import React from 'react'
import MuiList from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Box from '@mui/material/Box'
import ListItemText from '@mui/material/ListItemText'
import { useLocation, useNavigate } from 'react-router'

export const Nav: React.FC<{}> = () => {
    const navigate = useNavigate()
    const location = useLocation()
    return <Box style={{display: 'flex', flexDirection: 'column', flexShrink: 0}}>
        <MuiList>
            <ListItemButton onClick={() => navigate('/component')} selected={'/component' === location.pathname}>
                <ListItemText primary={'Component'}/>
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/widget')} selected={'/widget' === location.pathname}>
                <ListItemText primary={'Widget'}/>
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/selectable')} selected={'/selectable' === location.pathname}>
                <ListItemText primary={'Widget Selectable'}/>
            </ListItemButton>
        </MuiList>
    </Box>
}
