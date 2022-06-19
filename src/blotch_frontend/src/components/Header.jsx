import * as React from "react";
  
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import NameLogo from '../../assets/name_logo.png';
  
export default function Header({avatar}) {
  return (
      <AppBar position="static" style={{ background: '#15141A' }}>
        <Toolbar>
        <Box
            component="img"
            sx={{
                height: 64,
                m: "0.5rem"
            }}
            alt="Blotch logo."
            src={NameLogo}
        />
        <div style={{width: '90%'}}></div>
        <Box
            component="img"
            sx={{
                height: 64,
                width: 64,
                m: "0.5rem",
            }}
            alt="avatar"
            style={{borderRadius: '32px', right: '0'}}
            src={avatar}
        />
        </Toolbar>
      </AppBar>
  );
}
