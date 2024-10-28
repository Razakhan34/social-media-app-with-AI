import { useDispatch, useSelector } from "react-redux";
import "./SearchUser.css";
import { SearchRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getAllUsersInMain } from "../../store/actions/userActions";
import { toast } from "react-toastify";
import { allUsersInMainActions } from "../../store/slices/userSlices";

const SearchUser = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.allUsersInMain);

  const [name, setName] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllUsersInMain(name));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(allUsersInMainActions.clearError());
    }
    dispatch(getAllUsersInMain(name));
  }, [dispatch, error, name]);

  return (
    <div className="search-user-Card">
      <div className="search-user-CardInner">
        <label>Search your friends here</label>
        <div className="search-user-container">
          <div className="search-user-Icon">
            <SearchRounded />
          </div>
          <div className="search-user-InputContainer">
            <form onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="Enter name here.."
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
