import { Link } from "react-router-dom";
import "./Signin.css";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearUserError, userLogin } from "../../store/actions/userActions";

const Signin = () => {
  const dispatch = useDispatch();
  const { error, user } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(userLogin(email, password));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserError());
    }
    if (user) {
      toast.success("Login Successfully");
    }
  }, [dispatch, error, user]);
  return (
    <div className="signin-main-container">
      <div className="signin-container">
        <div className="form-signin-container sign-in-container">
          <form onSubmit={loginSubmitHandler}>
            <h1>Sign in</h1>
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
            <span>or use your account</span>
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
            <Link to="/forgot/password">Forgot Password?</Link>
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="overlay-signin-container">
          <div className="overlay">
            <div className="overlay-panel">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <Link to="/signup">
                <button className="ghost">Sign Up</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
