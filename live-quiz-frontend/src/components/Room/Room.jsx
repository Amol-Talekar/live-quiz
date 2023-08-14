import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { getSingleRoom } from "../../logic/Slices/getSingleRoomSlice";
import { FlexBox, RedSpan, StartQuizDiv } from "./style";

const socket = io("http://localhost:8020");

const Room = () => {
  const params = useParams();
  let dispatch = useDispatch();
  // console.log("params => ", params);
  const [roomId, setRoomId] = useState(params?.roomId);
  const [questions, setQuestions] = useState([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isUserReady, setIsUserReady] = useState(false);
  const [dummyIncrement, setDummyIncrement] = useState(0);

  const [quizState, setQuizState] = useState({
    isQuizActive: false,
    currentQuestionIndex: 0,
    questions: [],
    timer: 50,
    userAnswers: Array(5).fill(null),
  });

  console.log("quizState outside ----> ", quizState);

  const { singleRoomData } = useSelector((state) => state.singleRoom);
  console.log("singleRoomData ==> ", singleRoomData);
  // console.log("type of singleRoomData ==> ", Array.isArray(singleRoomData));

  const fetchSingleRoomDetails = () => {
    dispatch(getSingleRoom(roomId));
  };

  useEffect(() => {
    fetchSingleRoomDetails();
  }, [roomId]);

  useEffect(() => {
    socket.on("quizStarted", () => {
      setQuizState((prevState) => ({
        ...prevState,
        isQuizActive: true,
      }));
    });

    return () => {
      socket.off("quizStarted");
    };
  }, []);

  useEffect(() => {
    socket.on("newQuestions", (questions) => {
      setQuizState((prevState) => ({
        ...prevState,
        questions: questions,
      }));
    });

    return () => {
      socket.off("newQuestions");
    };
  }, []);

  useEffect(() => {
    socket.on("quizFinished", () => {
      setQuizState((prevState) => ({
        ...prevState,
        isQuizActive: false,
      }));
    });

    return () => {
      socket.off("quizFinished");
    };
  }, []);

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
    setIsUserReady(true);
    setQuizState();
    socket.emit("userReady", roomId);

    if (isUserReady) {
      socket.emit("startQuiz", roomId);
    }

    console.log("quizState=============> ", quizState);
  };

  useEffect(() => {
    socket.on("userJoined", ({ _id }) => {
      console.log("_id  =>>>>>>>>>>>>>>>>>>>>>>>>", _id);
      alert(`New User Joined with ID: ${_id}`);
      setDummyIncrement((prev) => prev + 1);

      fetchSingleRoomDetails();
    });

    return () => {
      socket.off("userJoined");
    };
  }, []);

  const handleAnswerChange = (questionIndex, answer) => {
    setQuizState((prevState) => {
      const newUserAnswers = [...prevState.userAnswers];
      newUserAnswers[questionIndex] = answer;
      return {
        ...prevState,
        userAnswers: newUserAnswers,
      };
    });
  };

  const handleSubmit = () => {
    socket.emit("submitAnswers", roomId, quizState.userAnswers);
  };

  return (
    <div>
      {isQuizStarted ? (
        <div>
          <h1>Quiz Started in room {roomId ? roomId : "-"}</h1>
          {
            <div>
              <h2>Quiz Questions</h2>
              <p>Remaining Time: {quizState?.timer} seconds</p>
              {quizState?.questions?.map((question, index) => (
                <div key={question?.questionId}>
                  <p>{question?.questionText}</p>
                  {question?.options?.map((option, optionIndex) => (
                    <label key={optionIndex}>
                      <input
                        type="radio"
                        name={`question_${index}`}
                        value={option}
                        onChange={(event) =>
                          handleAnswerChange(index, event.target.value)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ))}
              <button onClick={handleSubmit}>Submit Answers</button>
            </div>
          }
        </div>
      ) : (
        <StartQuizDiv>
          <h3>
            You are currently in the room{" "}
            {singleRoomData ? <RedSpan>{singleRoomData.name}</RedSpan> : "-"}
          </h3>
          <h4>With room id {singleRoomData._id}</h4>
          <div>
            with {singleRoomData?.users?.length} partipants
            <FlexBox>
              {singleRoomData?.users?.map((singleUser, index) => (
                <p key={singleUser._id}>
                  {index + 1}) {"   "}
                  {singleUser?.name}
                </p>
              ))}
            </FlexBox>
          </div>
          <button onClick={handleStartQuiz}>Start Quiz</button>
        </StartQuizDiv>
      )}
    </div>
  );
};

export default Room;
