import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import signinImage from "../assets/signup.jpg";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const cookies = new Cookies();

const initialState = {
  fullName: "",
  username: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  avatarURL: "",
};

const Auth = ({ isSignup, setIsSignup }) => {
  const [form, setForm] = useState(initialState);
  const [usernames, setUsernames] = useState([]);
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState(null);
  const [signupErrorMessage, setSignupErrorMessage] = useState(null);
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    checkUsername(form.username);
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (isSignup && e.target.name === "username") {
      checkUsername(e.target.value);
    }
  };

  function checkUsername(username) {
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setUsernameInvalid(true);
      setUsernameMessage("Username can only contain letters and numbers");
    } else if (username.length > 20) {
      setUsernameInvalid(true);
      setUsernameMessage("Must be between 1 and 20 characters in length");
    } else if (username !== "") {
      setUsernameInvalid(usernames.includes(username));
      if (usernameInvalid) {
        setUsernameMessage(`Username '${form.username}' not available`);
      } else {
        setUsernameMessage(`Username '${form.username}' is available`);
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, phoneNumber, avatarURL } = form;

    const URL = `${API_BASE_URL}/auth`;

    try {
      const {
        data: { token, userId, hashedPassword, fullName },
      } = await axios.post(`${URL}/${isSignup ? "signup" : "login"}`, {
        username,
        password,
        fullName: form.fullName,
        phoneNumber,
        avatarURL,
      });

      if (isSignup) {
        if (!/^[a-zA-Z0-9]+$/.test(form.username)) {
          throw new Error("Username can only contain letters and numbers.");
        } else if (username.length > 20) {
          throw new Error(
            "Username must be between 1 and 20 characters in length"
          );
        } else if (usernameInvalid) {
          throw new Error("This username is already taken.");
        } else if (form.password !== form.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
      }

      cookies.set("token", token);
      cookies.set("username", username);
      cookies.set("fullName", fullName);
      cookies.set("userId", userId);

      if (isSignup) {
        cookies.set("phoneNumber", phoneNumber);
        cookies.set("avatarURL", avatarURL);
        cookies.set("hashedPassword", hashedPassword);
        const user = {
          username: username,
        };
        createUser(user);
      }

      setSignupErrorMessage(null);
      setLoginErrorMessage(null);

      window.location.reload();
    } catch (error) {
      if (isSignup) {
        setSignupErrorMessage(error.message);
      } else {
        setLoginErrorMessage(
          "Your password is incorrect or this account doesn't exist."
        );
      }
    }
  };

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setSignupErrorMessage(null);
    setLoginErrorMessage(null);
  };

  async function getUsers() {
    fetch(`${API_BASE_URL}/users`)
      .then((response) => response.json())
      .then((data) => {
        setUsernames(() => data.map((user) => user.username));
      })
      .catch((error) => console.error(error));
  }

  // Call this function to send POST request to database
  async function createUser(user) {
    fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => console.error(error));
  }

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p>{isSignup ? "Sign Up" : "Sign In"}</p>
          {signupErrorMessage && isSignup && (
            <div className="auth__form-container_error-message">
              {signupErrorMessage}
            </div>
          )}
          {loginErrorMessage && !isSignup && (
            <div className="auth__form-container_error-message">
              {loginErrorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="fullName">Full Name*</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_input">
              {isSignup ? <label htmlFor="username">Username*</label> : <label htmlFor="username">Username</label> }
              <input
                name="username"
                type="text"
                placeholder="Username"
                onChange={handleChange}
                required
              />
              {isSignup && form.username !== "" && (
                <div className="auth__form-container_fields-content_username-check">
                  {usernameInvalid && (
                    <span className="red">{usernameMessage}</span>
                  )}
                  {!usernameInvalid && (
                    <span className="green">{usernameMessage}</span>
                  )}
                </div>
              )}
            </div>
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  onChange={handleChange}
                />
              </div>
            )}
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="avatarURL">Avatar URL</label>
                <input
                  name="avatarURL"
                  type="text"
                  placeholder="Avatar URL"
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_input">
              {isSignup ? <label htmlFor="password">Password*</label> : <label htmlFor="password">Password</label>}
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_button">
              <button>{isSignup ? "Sign Up" : "Sign In"}</button>
            </div>
          </form>
          <div className="auth__form-container_fields-account">
            <p>
              {isSignup
                ? "Already have an account? "
                : "Don't have an account? "}
              <span onClick={switchMode}>
                {isSignup ? "Sign In" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="auth__form-container_image">
        <img src={signinImage} alt="sign in" />
      </div>
    </div>
  );
};

export default Auth;
