
import {
  CLEAR_FEEDBACK,
  LOADING_QUESTIONS,
  POST_QUESTION_ANSWER,
  POST_USER,
  RECEIVE_QUESTIONS,
} from "./actionType";

import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import api from "../../api/api";

interface ReceiveQuestionsAction {
  type: typeof RECEIVE_QUESTIONS;
  payload: string[];
}

interface PostUserAction {
  type: typeof POST_USER;
  payload: {
    email: string;
    technology: string;
  };
}

export const loadingQuestions = () => ({
  type: LOADING_QUESTIONS as typeof LOADING_QUESTIONS,
});

export const fetchQuestion = (
  tech: string
): ThunkAction<void, {}, null, ReceiveQuestionsAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: LOADING_QUESTIONS });

    try {
      const res = await api.get(`/bot/${encodeURIComponent(tech)}`);

      const paragraphs =
        typeof res.data === "string"
          ? res.data.split("\n")
          : [];

      const questionsArray = paragraphs.filter(
        (paragraph: string) => /^\d+\.\s/.test(paragraph.trim())
      );

      console.log("Questions:", questionsArray);

      dispatch({
        type: RECEIVE_QUESTIONS,
        payload: questionsArray,
      });
    } catch (err: any) {
      console.error(
        "Failed to fetch questions:",
        err.response?.data || err.message
      );
    }
  };
};

export const postQuestionAnswer = (
  interviewId: number,
  question: string,
  answer: string
): ThunkAction<void, {}, null, ReceiveQuestionsAction> => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.post("/bot/answer", {
        interviewId,
        question,
        answer,
      });

      console.log("AI Feedback:", response.data);

      dispatch({
        type: POST_QUESTION_ANSWER,
        payload: response.data,
      });
    } catch (err: any) {
      console.error(
        "Failed to submit answer:",
        err.response?.data || err.message
      );
    }
  };
};

export const postUser = (
  email: string,
  technology: string
): ThunkAction<
  Promise<number | null>,
  {},
  null,
  PostUserAction
> => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.post("/bot/user", {
        email,
        technology,
      });

      console.log("Interview started response:", response.data);

      const interviewId = response.data.interviewId;

      console.log("Received Interview ID:", interviewId);

      return interviewId;
    } catch (err: any) {
      console.error(
        "Failed to create interview session:",
        err.response?.data || err.message
      );

      return null;
    }
  };
};

export const clearFeedback = () => ({
  type: CLEAR_FEEDBACK,
});

