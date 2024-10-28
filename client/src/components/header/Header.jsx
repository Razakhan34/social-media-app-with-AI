import React, { useState } from "react";
import {
  Home,
  HomeOutlined,
  Add,
  AddOutlined,
  SearchOutlined,
  Search,
  AccountCircle,
  AccountCircleOutlined,
} from "@mui/icons-material";
import TextsmsIcon from "@mui/icons-material/Textsms";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import "./Header.css";
import { Link } from "react-router-dom";
import HeaderLogo from "../../assets/networkhub.png";

const Header = () => {
  const [tab, setTab] = useState(window.location.pathname);
  return (
    <div className="header">
      <div className="main-logo">
        <div>
          <img src={HeaderLogo} alt="logo of the page" />
        </div>
        <Link to="/" onClick={() => setTab("/")}>
          <span>Social-hub</span>
        </Link>
      </div>
      <Link to="/" onClick={() => setTab("/")}>
        {tab === "/" ? <Home style={{ color: "black" }} /> : <HomeOutlined />}
      </Link>

      <Link to="/newpost" onClick={() => setTab("/newpost")}>
        {tab === "/newpost" ? (
          <Add style={{ color: "black" }} />
        ) : (
          <AddOutlined />
        )}
      </Link>

      <Link to="/search" onClick={() => setTab("/search")}>
        {tab === "/search" ? (
          <Search style={{ color: "black" }} />
        ) : (
          <SearchOutlined />
        )}
      </Link>

      <Link to="/chat" onClick={() => setTab("/chat")}>
        {tab === "/chat" ? (
          <TextsmsIcon style={{ color: "black" }} />
        ) : (
          <TextsmsOutlinedIcon />
        )}
      </Link>

      <Link to="/account" onClick={() => setTab("/account")}>
        {tab === "/account" ? (
          <AccountCircle style={{ color: "black" }} />
        ) : (
          <AccountCircleOutlined />
        )}
      </Link>
    </div>
  );
};

export default Header;
