import { Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material"
import React, { Fragment, useEffect, useState } from "react"
import { OnOffUser, OnOffUserList } from "../../api/group";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

interface OnTimerDetailProps {
    userList: OnOffUserList | null
    getUserList: () => void
}

function OnTimerDetail({ userList, getUserList }: OnTimerDetailProps) {

    const [state, setState] = useState(false)

    useEffect(()=>{
        getUserList()
    },[state])

    const toggleDrawer = (open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab'
                || (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
            setState(open)
        }

    const list = () => (
        <Box
            sx={{ mx: 3, my: 15, width: 350 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <h1>On Timer</h1>
            <List>
                {userList !== null &&
                    userList.filter((user: OnOffUser) => user.online === true)
                        .map((user: OnOffUser, index: number) => (
                            <ListItem button key={index}>
                                <Avatar
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        flexDirection: 'column',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'end',
                                    }}
                                    alt={`${user.userName}`}
                                    src={
                                        user.userImg
                                            ? user.userImg
                                            : '/images/Profile_Default.png'
                                    }
                                />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <ListItemText primary={`${user.userName}`} />
                            </ListItem>
                        ))}
            </List>
            <Divider />
            <h1>Other</h1>
            <List>
                {userList !== null &&
                    userList.filter((user: OnOffUser) => user.online !== true)
                        .map((user: OnOffUser, index: number) => (
                            <ListItem button key={index}>
                                <Avatar
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        flexDirection: 'column',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'end',
                                    }}
                                    alt={`${user.userName}`}
                                    src={
                                        user.userImg
                                            ? user.userImg
                                            : '/images/Profile_Default.png'
                                    }
                                />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <ListItemText primary={`${user.userName}`} />
                            </ListItem>
                        ))}
            </List>
            <Divider />
        </Box >
    )

    return (
        <Box>
            <Fragment key={'right'}>
                <IconButton onClick={toggleDrawer(true)}>
                    <MoreHorizRoundedIcon />
                </IconButton>
                <Drawer
                    anchor={'right'}
                    open={state}
                    onClose={toggleDrawer(false)}
                >
                    {list()}
                </Drawer>
            </Fragment>
        </Box>
    )
}

export default OnTimerDetail