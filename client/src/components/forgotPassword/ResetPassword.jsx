import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  clearUserFeatureError,
  clearUserFeatureMessage,
  userResetPassword,
} from "../../store/actions/userActions";

import "./ResetPassword.css";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const { loading, error, message } = useSelector((state) => state.userFeature);
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(userResetPassword(token, password));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserFeatureError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearUserFeatureMessage());
    }
  }, [dispatch, error, message]);

  return (
    <div className="resetPassword">
      <form className="resetPasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Network Hub
        </Typography>

        <input
          type="password"
          placeholder="New Password"
          required
          className="updatePasswordInputs"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link to="/">
          <Typography>Login</Typography>
        </Link>
        <Typography>Or</Typography>

        <Link to="/forgot/password">
          <Typography>Request Another Token!</Typography>
        </Link>

        <Button disabled={loading} type="submit">
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
