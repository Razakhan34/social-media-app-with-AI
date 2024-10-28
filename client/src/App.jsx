import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoad } from "./store/actions/userActions.js";
import Header from "./components/header/Header.jsx";
import Signin from "./components/login/Signin.jsx";
import Home from "./components/home/Home.jsx";
import Account from "./components/account/Account.jsx";
import NewPost from "./components/newpost/NewPost.jsx";
import UpdateProfile from "./components/updateProfile/UpdateProfile.jsx";
import UpdatePassword from "./components/updatePassword/UpdatePassword.jsx";
import ForgotPassword from "./components/forgotPassword/ForgotPassword.jsx";
import ResetPassword from "./components/forgotPassword/ResetPassword.jsx";
import UserProfile from "./components/userProfile/UserProfile.jsx";
import Search from "./components/search/Search.jsx";
import NotFound from "./components/notfound/NotFound.jsx";
import Chat from "./components/chat/Chat.jsx";
import { SocketContextProvider } from "./context/socketContex.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./components/register/Signup.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(userLoad());
  }, [dispatch]);

  return (
    <Router>
      <div>
        {isAuthenticated && <Header />}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Signin />} />
          <Route
            path="/account"
            element={isAuthenticated ? <Account /> : <Signin />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Account /> : <Signup />}
          />
          <Route
            path="/newpost"
            element={isAuthenticated ? <NewPost /> : <Signin />}
          />
          <Route
            path="/update/profile"
            element={isAuthenticated ? <UpdateProfile /> : <Signin />}
          />
          <Route
            path="/update/password"
            element={isAuthenticated ? <UpdatePassword /> : <Signin />}
          />
          <Route
            path="/forgot/password"
            element={isAuthenticated ? <UpdatePassword /> : <ForgotPassword />}
          />
          <Route
            path="/reset/password/:token"
            element={isAuthenticated ? <UpdatePassword /> : <ResetPassword />}
          />
          <Route
            path="/user/:userID"
            element={isAuthenticated ? <UserProfile /> : <Signin />}
          />
          <Route path="/search" element={<Search />} />
          <Route
            path="/chat"
            element={
              isAuthenticated ? (
                <SocketContextProvider>
                  <Chat />
                </SocketContextProvider>
              ) : (
                <Signin />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
