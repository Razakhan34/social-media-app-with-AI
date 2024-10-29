/* eslint-disable react/prop-types */
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const User = ({ userId, avatar, name }) => {
  return (
    <Link to={`/user/${userId}`} className="homeUser">
      <img src={avatar} alt={name} />
      <Typography>{name}</Typography>
    </Link>
  );
};

export default User;
