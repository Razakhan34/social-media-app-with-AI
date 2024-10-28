import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserFeatureError,
  clearUserFeatureMessage,
  userUpdatePassword,
} from "../../store/actions/userActions";

import "./UpdatePassword.css";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.userFeature);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(userUpdatePassword({ currentPassword, newPassword }));
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
    <div className="updatePassword">
      <form className="updatePasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Network Hub
        </Typography>

        <input
          type="password"
          placeholder="Current Password"
          required
          value={currentPassword}
          className="updatePasswordInputs"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          required
          className="updatePasswordInputs"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Button disabled={loading} type="submit">
          Change Password
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
