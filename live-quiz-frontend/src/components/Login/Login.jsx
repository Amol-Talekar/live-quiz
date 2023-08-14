import React, { useState } from "react";
import * as Styled from "./style.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { applyAuth } from "../../logic/Slices/authSlice.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();
  let dispatch = useDispatch();

  const handleLogin = () => {
    if (email && password) {
      // console.log({ email, password });
      let body = { email, password };
      dispatch(applyAuth(body)).then(() => navigate("/lobby"));
    }
  };

  return (
    <Styled.LoginContainer>
      <h2>Login</h2>

      <Styled.LabelInputDiv>
        <label>Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          value={email}
          type="email"
        />
      </Styled.LabelInputDiv>

      <Styled.LabelInputDiv>
        <label>Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          value={password}
          type="password"
        />
      </Styled.LabelInputDiv>

      <Styled.SubmitButton onClick={handleLogin}>Login</Styled.SubmitButton>
    </Styled.LoginContainer>
  );
};

export default Login;
