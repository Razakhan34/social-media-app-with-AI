import { Link } from "react-router-dom";
import "./Signup.css";

import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearUserError, userRegister } from "../../store/actions/userActions";
import { toast } from "react-toastify";
import { Avatar } from "@mui/material";
const Signup = () => {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatar(Reader.result);
      }
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(userRegister({ name, email, password, avatar }));
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserError());
    }
    if (user) {
      toast.success("You have been registered successfully!!!");
    }
  }, [dispatch, error, user]);

  return (
    <div className="signup-main-container">
      <div className="signup-container right-panel-active">
        <div className="form-signup-container">
          <form onSubmit={submitHandler}>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <GoogleIcon />
              </a>
              <a href="#" className="social">
                <FacebookIcon />
              </a>
              <a href="#" className="social">
                <LinkedInIcon />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Avatar
              src={avatar}
              alt="User"
              sx={{ height: "1vmax", width: "1vmax" }}
            />

            <input type="file" accept="image/*" onChange={handleImageChange} />

            <button type="submit" disabled={loading}>
              Sign Up
            </button>
          </form>
        </div>
        <div className="overlay-signup-container">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <Link to="/">
                <button className="ghost">Sign In</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
