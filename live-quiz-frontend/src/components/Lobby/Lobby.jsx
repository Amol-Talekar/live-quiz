import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllRooms } from "../../logic/Slices/getRoomsSlice";
import * as Styled from "./style.js";
import { createRoom } from "../../logic/Slices/createRoomSlice";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";
import jwtDecode from "jwt-decode";

const currentToken = localStorage?.getItem("livequizAuthToken");
let decoded_user;

//console.log("decoded_user => ", decoded_user);
if (currentToken && currentToken !== null && currentToken != undefined) {
  decoded_user = jwt_decode(currentToken);
}

const socket = io("http://localhost:8020", {
  query: {
    _id: decoded_user?._id,
  },
});

const Lobby = () => {
  const { roomsData } = useSelector((state) => state.allRooms);
  const { token } = useSelector((state) => state.auth);
  let currentUser = jwtDecode(token);
  //console.log("currentToken => ", currentUser);

  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState();
  let dispatch = useDispatch();
  let navigate = useNavigate();

  //console.log("roomsData =======>>>", roomsData);

  useEffect(() => {
    socket.on("roomCreated", (newRoom) => {
      setRooms((prevRooms) => [...prevRooms, newRoom]);
    });

    socket.on("allrooms", (rooms) => {
      setRooms(rooms);
    });

    socket.on("error", (error) => {
      console.error(error);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("allrooms");
      socket.off("error");
    };
  }, [roomsData]);

  const fetchAllRoomsData = () => {
    dispatch(getAllRooms());
  };

  useEffect(() => {
    fetchAllRoomsData();
  }, []);

  useEffect(() => {
    setRooms(roomsData);
  }, [roomsData]);

  const handleCreate = () => {
    let name = roomName;
    dispatch(createRoom({ name }));
    socket.on("roomCreated", (tempRoom) => {
      setRooms((prevRooms) => [...prevRooms, tempRoom]);
    });

    socket.once("roomId", (roomId) => {
      navigate(`/room/${roomId}`);
    });
  };

  const handleJoin = () => {
    socket.emit("joinRoom", { name: roomName, _id: currentUser?._id });
    socket.once("roomId", (roomId) => {
      console.log("this is roomId from handleJoin function => ", roomId);

      navigate(`/room/${roomId}`);
    });
  };

  return (
    <Styled.LobbyContainer>
      <Styled.RoomNameContainer>
        {rooms && rooms?.length > 0
          ? rooms.map((item, index) => (
              <Styled.RoomNameCapacityBox key={item._id}>
                <p>{item.name}</p>{" "}
                <span>
                  ({item?.users?.length}){" "}
                  {item?.users?.length == 1 ? "Join" : "Full"}
                </span>
              </Styled.RoomNameCapacityBox>
            ))
          : null}
      </Styled.RoomNameContainer>
      <Styled.CreateJoinContainer>
        <Styled.LabelInputBox>
          <label>Create Room</label>
          <input
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="what name you want for your room?"
          />
          <button onClick={handleCreate}>Create</button>
        </Styled.LabelInputBox>

        <Styled.LabelInputBox>
          <label>Join Room</label>
          <input
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Which room you want to join?"
          />
          <button onClick={handleJoin}>Join</button>
        </Styled.LabelInputBox>
      </Styled.CreateJoinContainer>
    </Styled.LobbyContainer>
  );
};

export default Lobby;
