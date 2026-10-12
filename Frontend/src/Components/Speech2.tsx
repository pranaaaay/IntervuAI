
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Video from "./Video";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFeedback,
  fetchQuestion,
  postQuestionAnswer,
  postUser,
} from "../Redux/nodeReducer/action";
import { useNavigate, useParams } from "react-router-dom";
import {
  BsFillMicFill,
  BsFillMicMuteFill,
  BsSoundwave,
} from "react-icons/bs";
import api from "../api/api";

const Speech2 = () => {
  const [text, setText] = useState("");
  const [interviewStart, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrent] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const navigate = useNavigate();
  const { tech = "" } = useParams();

  const questions = useSelector((state: any) => state.questions);
  const loading = useSelector((state: any) => state.loading);
  const feedback = useSelector((state: any) => state.feedback);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<any>(fetchQuestion(tech));
  }, [dispatch, tech]);

  const handleStartInterview = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      alert("Please login before starting the interview.");
      navigate("/login");
      return;
    }

    const interviewId = await dispatch<any>(postUser(userEmail, tech));

    if (!interviewId) {
      alert("Unable to start the interview. Please try again.");
      return;
    }

    localStorage.setItem("currentInterviewId", interviewId.toString());
    setInterviewStarted(true);
    setCurrent(0);
    dispatch(clearFeedback());
  };

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
    });
  };

  const resetTranscript = () => {
    SpeechRecognition.stopListening();
    setText("");
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
    });
  };

  const {
    listening,
    transcript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrent(currentQuestion + 1);
      resetTranscript();
      dispatch(clearFeedback());
    }
  };

  const handleFinish = async () => {
    if (finishing) return;

    const interviewId = localStorage.getItem("currentInterviewId");

    if (!interviewId) {
      alert("Interview ID not found. Please restart the interview.");
      return;
    }

    setFinishing(true);
    SpeechRecognition.stopListening();

    try {
      const response = await api.put(
        `/interview/${interviewId}/complete`
      );

      console.log("Interview completed successfully:", response.data);

      localStorage.removeItem("currentInterviewId");
      setInterviewStarted(false);
      navigate("/endinterview");
    } catch (error: any) {
      console.error(
        "Error completing interview:",
        error.response?.data || error.message
      );

      alert(
        error.response?.status === 403
          ? "Access denied. Please log in again and retry."
          : "Unable to complete the interview. Please try again."
      );
    } finally {
      setFinishing(false);
    }
  };

  const submitQuestion = () => {
    const answer = transcript.trim() || text.trim();

    if (!answer) {
      alert("Please provide an answer before submitting.");
      return;
    }

    const interviewId = localStorage.getItem("currentInterviewId");

    if (!interviewId) {
      alert("Interview session not found. Please restart the interview.");
      return;
    }

    dispatch<any>(
      postQuestionAnswer(
        Number(interviewId),
        questions[currentQuestion],
        answer
      )
    );
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-center mt-10">
        <h2>Your browser does not support speech recognition.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-5">
            <Video />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-blue-900">
                AI Interview
              </h1>

              {interviewStart && (
                <span className="bg-green-100 text-green-700 px-3 py-2 rounded-lg font-semibold">
                  Interview Started
                </span>
              )}
            </div>

            {!interviewStart ? (
              <div className="text-center py-10">
                <h2 className="text-xl font-semibold mb-5">
                  Ready to start your interview?
                </h2>

                <button
                  onClick={handleStartInterview}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Start Interview
                </button>
              </div>
            ) : loading ? (
              <div className="text-center py-10">
                <h2 className="text-xl font-semibold">
                  Loading questions...
                </h2>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-10">
                <h2 className="text-xl font-semibold">
                  No questions available.
                </h2>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Question {currentQuestion + 1} of {questions.length}
                  </h2>

                  {currentQuestion === questions.length - 1 && (
                    <button
                      onClick={handleFinish}
                      disabled={finishing}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-60"
                    >
                      {finishing ? "Finishing..." : "Finish Interview"}
                    </button>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-5">
                  <h3 className="text-xl font-semibold text-blue-900">
                    {questions[currentQuestion]}
                  </h3>
                </div>

                <textarea
                  value={transcript || text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Speak your answer or type here..."
                  className="w-full border rounded-lg p-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex flex-wrap gap-3 mt-4">
                  {!listening ? (
                    <button
                      onClick={startListening}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                    >
                      <BsFillMicFill />
                      Start Mic
                    </button>
                  ) : (
                    <button
                      onClick={() => SpeechRecognition.stopListening()}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600"
                    >
                      <BsFillMicMuteFill />
                      Stop Mic
                    </button>
                  )}

                  <button
                    onClick={submitQuestion}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                  >
                    <BsSoundwave />
                    Submit Answer
                  </button>

                  <button
                    onClick={resetTranscript}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Reset
                  </button>
                </div>

                {feedback && (
                  <div className="mt-6 bg-gray-50 border rounded-lg p-5">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">
                      AI Feedback
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                      <div className="bg-blue-100 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Subject Expertise
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          {feedback.subjectExperties}/10
                        </p>
                      </div>

                      <div className="bg-green-100 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Communication
                        </p>
                        <p className="text-2xl font-bold text-green-700">
                          {feedback.communicationSkill}/10
                        </p>
                      </div>

                      <div className="bg-purple-100 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Problem Solving
                        </p>
                        <p className="text-2xl font-bold text-purple-700">
                          {feedback.problemSolving}/10
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <h4 className="font-bold text-blue-900 mb-2">
                        Feedback
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line">
                            {feedback.feedBackMessage}
                           </p>
                    </div>
                  </div>
                )}

                {currentQuestion < questions.length - 1 && (
                  <button
                    onClick={handleNextQuestion}
                    className="mt-5 bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700"
                  >
                    Next Question
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speech2;
