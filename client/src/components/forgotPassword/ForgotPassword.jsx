import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserFeatureError,
  clearUserFeatureMessage,
  userForgotPassword,
} from "../../store/actions/userActions";
import "./ForgotPassword.css";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.userFeature);
  const [email, setEmail] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(userForgotPassword(email));
    setEmail("");
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
    <div className="forgotPassword">
      <form className="forgotPasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Network Hub
        </Typography>
        <input
          type="email"
          placeholder="Email"
          required
          className="forgotPasswordInputs"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button disabled={loading} type="submit">
          Send Token
        </Button>
      </form>
    </div>
  );
};
export default ForgotPassword;
