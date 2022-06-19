import * as React from "react";
  
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CardMedia from '@mui/material/CardMedia';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NameLogo from '../../assets/name_logo.png';
  
export default function Header() {
  return (
      <AppBar position="static" style={{ background: '#FFF0D3' }}>
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
        </Toolbar>
      </AppBar>
  );
}
