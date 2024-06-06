import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Toolbar,
  Box,
  Button,
  Grid,
  TextField,
  Alert,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Checkbox,
  FormControlLabel,
  Modal,
} from "@mui/material";
import logo from "../assets/logo.png";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import qs from "qs";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useEffect } from "react";
import { saveQueryOnSearch } from "./functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

 let backendurl='http://localhost:5000';
// let backendurl = "https://backend-7uej64gd5a-uc.a.run.app";

const Header = (props) => {
  const { userobj, savedDocsListCounterNumber } = props;
  const [searchBarDisplay, setSearchBarDisplay] = useState(0);
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("searchTerm")
  );
  const [loading, setLoading] = useState(0);
  const [displayProfileBox, setDisplayProfileBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [emailState, setEmailState] = useState("");
  const [loginSignupSelector, setLoginSignupSelector] = useState("Login");
  const [savedListCounter, setSavedListCounter] = useState(0);
  const [checked, setChecked] = useState(false);
  const [previousSearchTopic, setpreviousSearchTopic] = useState(
    localStorage.getItem("searchTopic")
  );
  const handleChange = (event) => {
    setChecked(event.target.checked);
    // console.log(event.target.checked);
    // console.log(previousSearchTopic);
    if (event.target.checked == true) {
      setpreviousSearchTopic(localStorage.getItem("searchTopic"));
      localStorage.removeItem("searchTopic");
      setSearchTerm("");
    }
    else {
      localStorage.setItem("searchTopic", previousSearchTopic);
    }
  };

  const navigate = useNavigate();

  const updateSavedListCounter = (uid) => {
    axios({
      method: "post",
      url: backendurl + "/saveddocs/controlnumberslist",
      data: qs.stringify({
        userId: uid,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
      .then(function (response) {
        setSavedListCounter(response.data.list.length);
        // console.log(response.data.list);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (userobj._id != "" && userobj._id != null)
      updateSavedListCounter(userobj._id);
  }, []);

  const getSearchResult = (page) => {
    if (
      document.getElementsByClassName("searchtextbox")[0].value.trim().length >
      0
    ) {
      setLoading(1);

      localStorage.setItem("searchTerm", searchTerm);
      var searchTopic = localStorage.getItem("searchTopic");

      if (searchTopic === null) {
        localStorage.setItem("searchTopic", searchTerm);
      }
      if (userobj._id != "" && userobj._id != null) {
        saveQueryOnSearch(
          searchTerm,
          userobj._id,
          localStorage.getItem("searchTopic")
        );
      }
      window.location = "/results";
    } else {
      // solution 1
      // alert('Please insert a query.')

      // solution 2
      var element = document.getElementsByClassName("searchtextbox")[0];
      element.insertAdjacentHTML(
        "afterend",
        '<p id="error-text" class="error-text" style="color:red;">Please insert a query</p>'
      );
    }
  };

  const LoginSignUpSection = () => {
    const LoginBox = () => {
      const submitLogin = () => {
        var user = document.getElementById("username").value;
        var pass = document.getElementById("password").value;
        setUsername(user);
        setPassword(pass);

        setLoading(true);
        axios({
          method: "post",
          url: backendurl + "/users/login",
          data: qs.stringify({
            username: user,
            password: pass,
          }),
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        })
          .then(function (response) {
            setUsername("");
            setPassword("");
            setErrorMessage();
            localStorage.setItem("user", JSON.stringify(response.data));
            window.location.replace("");
            setLoading(false);
            // console.log(response.data);
          })
          .catch(function (error) {
            setErrorMessage(error.response.data.error);
            setLoading(false);
          });
      };

      return (
        <div
          style={{
            width: "calc(100% - 40px)",
            margin: "0px 20px 20px 20px",
            display: loginSignupSelector == "Login" ? "inline-block" : "none",
          }}
          id="LoginBox"
        >
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="dense"
              required
              fullWidth
              id="username"
              label="Username/Email"
              name="username"
              autoComplete="username"
              color="secondary"
              defaultValue={username}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              color="secondary"
              defaultValue={password}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 0 }}
              onClick={() => submitLogin()}
            >
              Login
            </Button>
            {errorMessage != "" && errorMessage != null ? (
              <Alert style={{ marginTop: 20 }} severity="error">
                {errorMessage}
              </Alert>
            ) : (
              ""
            )}
          </Box>
        </div>
      );
    };

    const SignUpBox = () => {
      const submitSignUp = () => {
        var user = document.getElementById("username2").value;
        var pass = document.getElementById("password2").value;
        var repass = document.getElementById("repassword2").value;
        var email = document.getElementById("email2").value;
        setUsername(user);
        setPassword(pass);
        setRePassword(repass);
        setEmailState(email);

        setLoading(true);
        axios({
          method: "post",
          url: backendurl + "/users/signup",
          data: qs.stringify({
            username: user,
            password: pass,
            repassword: repass,
            email: email,
          }),
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        })
          .then(function (response) {
            setUsername("");
            setPassword("");
            setRePassword("");
            setEmailState("");
            setErrorMessage();
            localStorage.setItem("user", JSON.stringify(response.data));
            window.location.replace("/");
            setLoading(false);
            // console.log(response.data);
          })
          .catch(function (error) {
            setErrorMessage(error.response.data.error);
            setLoading(false);
          });
      };

      return (
        <div
          style={{
            width: "calc(100% - 40px)",
            margin: "0px 20px 20px 20px",
            display: loginSignupSelector == "SignUp" ? "inline-block" : "none",
          }}
          id="SignUpBox"
        >
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="dense"
              required
              fullWidth
              id="username2"
              label="Username"
              name="username2"
              autoComplete="username2"
              color="secondary"
              defaultValue={username}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="password2"
              label="Password"
              type="password"
              id="password2"
              autoComplete="current-password2"
              color="secondary"
              defaultValue={password}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="repassword2"
              label="Password Confirmation"
              type="password"
              id="repassword2"
              autoComplete="current-repassword2"
              color="secondary"
              defaultValue={rePassword}
            />
            <TextField
              margin="dense"
              fullWidth
              id="email2"
              label="Email"
              name="email2"
              autoComplete="email2"
              color="secondary"
              defaultValue={emailState}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 0 }}
              onClick={() => submitSignUp()}
            >
              SignUp
            </Button>
            {errorMessage != "" && errorMessage != null ? (
              <Alert severity="error" style={{ marginTop: 20 }}>
                {errorMessage}
              </Alert>
            ) : (
              ""
            )}
          </Box>
        </div>
      );
    };

    const changeTab = (tabname) => {
      setLoginSignupSelector(tabname);
      setUsername("");
      setEmailState("");
      setPassword("");
      setRePassword("");
      setErrorMessage("");
    };

    // This function will detect if the user clicks outside of the login/signup box and closes the box
    function useOutsideAlerter(ref) {
      useEffect(() => {
        function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target)) {
            if (displayProfileBox == true) {
              setDisplayProfileBox(false);
            }
          }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [ref]);
    }
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    return (
      <div style={{ position: "absoulute" }}>
        <div
          onClick={() => setDisplayProfileBox(!displayProfileBox)}
          style={{
            display: "inline-block",
            position: "absolute",
            right: 0,
            paddingBottom: "10px",
            color: "#00335b",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "-20px",
            cursor: "pointer",
          }}
        >
          <PersonIcon
            style={{
              color: "rgb(89, 182, 199)",
              fontSize: "36px",
              position: "relative",
              top: "13px",
            }}
          />
          Login/SignUp
          <KeyboardArrowDownIcon
            style={{
              color: "rgb(89, 182, 199)",
              position: "relative",
              top: "8px",
            }}
          />
        </div>
        <div
          ref={wrapperRef}
          className="profilebox"
          style={{
            display: displayProfileBox == false ? "none" : "inline-block",
          }}
        >
          <Box style={{ margin: "20px 20px 0px 20px" }}>
            <Button
              onClick={() => changeTab("Login")}
              variant={
                loginSignupSelector == "Login" ? "contained" : "outlined"
              }
            >
              Login
            </Button>{" "}
            &nbsp;
            <Button
              onClick={() => changeTab("SignUp")}
              variant={
                loginSignupSelector == "SignUp" ? "contained" : "outlined"
              }
            >
              SignUp
            </Button>
          </Box>
          <LoginBox />
          <SignUpBox />
        </div>
      </div>
    );
  };

  const ProfileSection = () => {
    const logout = () => {
      localStorage.setItem("user", "");
      window.location = "/";
    };

    // This function will detect if the user clicks outside of the login/signup box and closes the box
    function useOutsideAlerter(ref) {
      useEffect(() => {
        function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target)) {
            if (displayProfileBox == true) {
              setDisplayProfileBox(false);
            }
          }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [ref]);
    }
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    return (
      <div style={{ position: "absoulute" }}>
        <div
          onClick={() => setDisplayProfileBox(!displayProfileBox)}
          style={{
            display: "inline-block",
            position: "absolute",
            right: 0,
            paddingBottom: "10px",
            color: "#00335b",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "-20px",
            cursor: "pointer",
          }}
        >
          <PersonIcon
            style={{
              color: "rgb(89, 182, 199)",
              fontSize: "36px",
              position: "relative",
              top: "13px",
            }}
          />
          My Account
          <KeyboardArrowDownIcon
            style={{
              color: "rgb(89, 182, 199)",
              position: "relative",
              top: "8px",
            }}
          />
        </div>
        <div
          ref={wrapperRef}
          className="profilebox2"
          style={{
            display: displayProfileBox == false ? "none" : "inline-block",
          }}
        >
          <Box
            style={{
              height: 18,
              backgroundColor: "rgb(0,51,91)",
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              color: "white",
              padding: 5,
              textAlign: "center",
            }}
          >
            Welcome{" "}
            <span style={{ color: "rgb(89, 182, 199)", fontWeight: "bolder" }}>
              {userobj.username}
            </span>
            ,
          </Box>
          <Box
            style={{
              borderBottom: "1px solid #ccc",
              padding: "10px 0px",
              textAlign: "center",
            }}
          >
            <Button
              size="large"
              style={{ fontWeight: "bolder" }}
              onClick={() => logout()}
            >
              Logout
            </Button>
          </Box>
          <MenuList>
            {/* <MenuItem component={Link} to="/saveddocslist">
              <ListItemIcon>
                <ListAltIcon style={{ color: "rgb(89, 182, 199)" }} />
              </ListItemIcon>
              <ListItemText>
                {savedDocsListCounterNumber != "" &&
                savedDocsListCounterNumber != null
                  ? savedDocsListCounterNumber
                  : savedListCounter}{" "}
                Saved Documents List
              </ListItemText>
              <Typography
                variant="body2"
                style={{ color: "rgb(0,51,91)", fontWeight: "bolder" }}
              >
                VIEW
              </Typography>
            </MenuItem> */}

            <MenuItem component={Link} to="/topicslist">
              <ListItemIcon>
                <ListAltIcon style={{ color: "rgb(89, 182, 199)" }} />
              </ListItemIcon>
              <ListItemText>Workspaces</ListItemText>
              <Typography
                variant="body2"
                style={{ color: "rgb(0,51,91)", fontWeight: "bolder" }}
              >
                VIEW
              </Typography>
            </MenuItem>
          </MenuList>
        </div>
      </div>
    );
  };

  const SearchSection = () => {
    return (
      <div
        className="searchbutton"
        onClick={() => {
          setSearchBarDisplay(!searchBarDisplay);
        }}
      >
        {searchBarDisplay == 0 ? (
          <SearchIcon
            style={{
              position: "relative",
              top: "5px",
              fontSize: 20,
              fontWeight: "bold",
            }}
          />
        ) : (
          <CloseIcon
            style={{
              position: "relative",
              top: "5px",
              fontSize: 20,
              fontWeight: "bold",
            }}
          />
        )}
        {searchBarDisplay == 0 ? "Search " : "Close "}
      </div>
    );
  };

  const clearTopicWrapper = () => {
    localStorage.removeItem("searchTopic");
  };

  const SearchTopicResume = ({ closeToast, toastProps }) => (
    <div>
      <p
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        New Topic Created
        <Button
          variant="outlined"
          style={{ float: "right" }}
          onClick={() => {
            undoTopicCreation();
          }}
        >
          Undo
        </Button>
      </p>
    </div>
  );

  function showToast() {
    console.log("Toast called");
    toast.success(<SearchTopicResume />, { icon: false });
  }

  function undoTopicCreation() {
    toast.dismiss();
    localStorage.setItem(
      "searchTopic",
      localStorage.getItem("previousSearchTopic")
    );
    toast.success(
      "'" + localStorage.getItem("searchTopic") + "'" + " Resumed",
      { icon: false }
    );
  }

  const LoginSignUpSectionModal = () => {
    const modalstyle = {
      position: "absolute",
      top: "55%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      bgcolor: "background.paper",
      border: "2px solid darkgrey",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4,
    };

    const submitSignUpLogin = () => {
      var user = document.getElementById("username222").value;
      setUsername(user);

      setLoading(true);
      axios({
        method: "post",
        url: backendurl + "/users/signuplogin",
        data: qs.stringify({
          username: user,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
        .then(function (response) {
          setUsername("");
          setErrorMessage();
          localStorage.setItem("user", JSON.stringify(response.data));
          window.location.replace("/");
          setLoading(false);
          // console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
          setErrorMessage(error.response.data.error);
          setLoading(false);
        });
    };

    return (
      <Modal
        open={true}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ zIndex: 100000000000000000 }}
      >
        <Box sx={modalstyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please enter your participant ID or username to start using the interface.
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="dense"
              required
              fullWidth
              id="username222"
              label="Partcipant ID/ Username"
              name="username222"
              autoComplete="username222"
              color="secondary"
              defaultValue={username}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 0 }}
              onClick={() => submitSignUpLogin()}
            >
              Enter
            </Button>
            {errorMessage != "" && errorMessage != null ? (
              <Alert severity="error" style={{ marginTop: 20 }}>
                {errorMessage}
              </Alert>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      {/* {(Loading==1 ? <LinearProgress /> : '')} */}

      <Container className="header" style={{ zIndex: 100002 }}>
        <Toolbar sx={{ height: "100%", position: "relative" }}>
          <Link to="/">
            <img src={logo} style={{ position: "relative", left: "-25px" }} />
          </Link>
          {userobj._id != "" && userobj._id != null ? (
            <ProfileSection />
          ) : (
            <LoginSignUpSectionModal />
          )}
          <SearchSection />
        </Toolbar>
      </Container>
      <div style={{ zIndex: 100001, position: "relative", top: -120 }}>
        <div
          align="center"
          style={{
            backgroundColor: "rgb(0, 51, 91)",
            transition: "all 1s",
            height: searchBarDisplay == 0 ? "0px" : "380px",
            overflow: "hidden",
            width: "100%",
            position: "absolute",
            left: 0,
            top: 120,
          }}
        >
          <Container
            align="left"
            style={{
              marginTop: 50,
              padding: 0,
              color: "white",
              maxWidth: "740px",
              width: "calc(100% - 50px)",
            }}
          >
            <h2>
              Ongoing Topic:{" "}
              {checked ? searchTerm : localStorage.getItem("searchTopic")}
            </h2>
            Find books, music, movies, and more <br></br>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="searchtextbox"
              placeholder="Search..."
            />
            <Grid
              container
              sx={{ marginTop: "30px", width: "calc(100% + 0px)" }}
            >
              <Grid item xs={6}>
                Search In
                <select
                  className="searchselectbox"
                  style={{ width: "calc(100% - 20px)" }}
                >
                  <option>Catalogue</option>
                </select>
              </Grid>
              <Grid item xs={6}>
                Filter by
                <select className="searchselectbox">
                  <option>Keyword</option>
                </select>
              </Grid>
            </Grid>
            <br />{" "}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                sx={{ width: 140, marginTop: "10px" }}
                color="inherit"
                variant="outlined"
                onClick={() => getSearchResult(1)}
              >
                SEARCH
              </Button>{" "}
              {/* <Button
              sx={{ width: 200, marginTop: "10px" }}
              color="inherit"
              variant="outlined"
              onClick={() => {
                localStorage.setItem("previousSearchTopic",localStorage.getItem("searchTopic"));
                localStorage.removeItem("searchTopic");
                setSearchTerm("");
                showToast();
              }
              }
            >
              Create new Topic
            </Button> */}
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "white",
                    }}
                    checked={checked}
                    onChange={handleChange}
                  />
                }
                label="Create New Topic"
              />
            </div>
          </Container>
        </div>
      </div>
      <ToastContainer theme="light" position="bottom-right" />
    </>
  );
};

export default Header;
