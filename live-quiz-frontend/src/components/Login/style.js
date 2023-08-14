import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  padding: 40px;
  border-radius: 12px;

  h2 {
    margin-top: 0px;
  }
`;

export const LabelInputDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 8px;
  label {
    flex-basis: 25%;
    padding: 8px;
    font-weight: bold;
    min-width: 70px;

    text-align: left;
  }

  input {
    flex-basis: 75%;
    padding: 8px;
    border-radius: 12px;
    border: 1px solid gray;
    min-width: 120px;
  }
`;

export const SubmitButton = styled.button`
  border-radius: 12px;
  padding: 8px;
  width: 100%;

  background-color: white;
  color: blue;
  border: 1px solid blue;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: aqua;
    color: blue;
    border: none;
    border: 1px solid aqua;
  }
`;
