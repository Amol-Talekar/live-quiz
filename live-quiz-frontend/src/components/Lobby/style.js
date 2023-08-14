import styled from "styled-components";

export const LobbyContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

export const RoomNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  height: 90vh;
  border: 1px solid gray;
`;

export const CreateJoinContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  height: 90vh;
  border: 1px solid gray;
`;

export const RoomNameCapacityBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;

  p {
    margin: 0px;
    padding: 0px;
  }
`;

export const LabelInputBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;

  label {
    padding: 8px;
    font-weight: bold;
  }

  input {
    padding: 8px;
    border-radius: 12px;
    border: 1px solid gray;
  }

  button {
    border: none;
    padding: 8px;
    cursor: pointer;
    background-color: white;
    color: blue;
    border: 1px solid blue;
    border-radius: 12px;
    min-width: 90px;
    &:hover {
      background-color: blue;
      color: white;
    }
  }
`;
