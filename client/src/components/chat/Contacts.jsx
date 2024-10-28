import { useEffect, useState } from "react";
import ContactsList from "./ContactsList";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAllUsersError,
  getAllUsers,
} from "../../store/actions/userActions";

const Contacts = () => {
  const dispatch = useDispatch();
  const { loading, error, users } = useSelector((state) => state.allUser);

  const [name, setName] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllUsers(name));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUsersError());
    }
    dispatch(getAllUsers(name));
  }, [dispatch, error, name]);
  return (
    <div className="chat-contacts">
      <i className="fas fa-bars fa-2x"></i>
      <h2>Contacts</h2>

      <form action="" onSubmit={submitHandler}>
        <div className="chat-contact-search">
          <input
            type="text"
            className="chat-search-input"
            placeholder="Search..."
            required
            onChange={(e) => setName(e.target.value)}
          />
          <button disabled={loading} className="chat-search-button">
            Search
          </button>
        </div>
      </form>

      <ContactsList conversations={users} />
    </div>
  );
};

export default Contacts;
