
import React, { useEffect, useState } from "react";
import api from "../api/api";

interface Feedback {
  subjectExperties?: number;
  subjectExpertise?: number;
  communicationSkill?: number;
  problemSolving?: number;
  feedBackMessage?: string;
  feedbackMessage?: string;
  aiFeedback?: string;
}

interface Interview {
  id?: number;
  interviewId?: number;
  technology?: string;
  tech?: string;
  status?: string;
  interviewDate?: string;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  date?: string;
  feedBackList?: Feedback[];
  feedBacks?: Feedback[];
  feedbacks?: Feedback[];
  feedback?: Feedback | Feedback[];
  feedBack?: Feedback | Feedback[];
  [key: string]: any;
}

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const email = localStorage.getItem("userEmail");

      if (!email) {
        setError("Please log in to view your interview history.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/interview/history?email=${encodeURIComponent(email)}`
        );

        const data = response.data;

        const records = Array.isArray(data)
          ? data
          : Array.isArray(data?.interviews)
          ? data.interviews
          : [];

        console.log("Interview history response:", records);
        setInterviews(records);
      } catch (err: any) {
        console.error(
          "Failed to load interview history:",
          err.response?.data || err.message
        );

        setError(
          err.response?.status === 401 ||
            err.response?.status === 403
            ? "Your session may have expired. Please log in again."
            : "Unable to load interview history. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getFeedback = (interview: Interview): Feedback[] => {
    const source =
      interview.feedBackList ??
      interview.feedBacks ??
      interview.feedbacks ??
      interview.feedback ??
      interview.feedBack;

    if (Array.isArray(source)) return source;

    if (source && typeof source === "object") {
      return [source as Feedback];
    }

    return [];
  };

  const formatDate = (value?: string) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Interview History
        </h1>

        <p className="text-gray-600 mb-8">
          View your previous interviews, scores, and AI feedback.
        </p>

        {loading && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-lg text-gray-600">
              Loading interview history...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {!loading && !error && interviews.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No interviews found
            </h2>
            <p className="text-gray-600">
              Complete an interview to see it listed here.
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-5">
            {interviews.map((interview, index) => {
              const id = interview.id ?? interview.interviewId ?? index;
              const technology =
                interview.technology ?? interview.tech ?? "Interview";
              const status = interview.status ?? "Unknown";

              const date =
                interview.interviewDate ??
                interview.completedAt ??
                interview.createdAt ??
                interview.startedAt ??
                interview.date;

              const feedback = getFeedback(interview);

              const subjectScores = feedback
                .map((item) => item.subjectExperties ?? item.subjectExpertise)
                .filter(
                  (value): value is number =>
                    typeof value === "number" && Number.isFinite(value)
                );

              const communicationScores = feedback
                .map((item) => item.communicationSkill)
                .filter(
                  (value): value is number =>
                    typeof value === "number" && Number.isFinite(value)
                );

              const problemScores = feedback
                .map((item) => item.problemSolving)
                .filter(
                  (value): value is number =>
                    typeof value === "number" && Number.isFinite(value)
                );

              const average = (values: number[]) =>
                values.length
                  ? values.reduce((sum, value) => sum + value, 0) /
                    values.length
                  : null;

              const messages = feedback
                .map(
                  (item) =>
                    item.feedBackMessage ??
                    item.feedbackMessage ??
                    item.aiFeedback
                )
                .filter(
                  (message): message is string =>
                    typeof message === "string" &&
                    message.trim().length > 0
                );

              const scores = [
                {
                  label: "Subject Expertise",
                  value: average(subjectScores),
                  style: "bg-blue-50 text-blue-700",
                },
                {
                  label: "Communication",
                  value: average(communicationScores),
                  style: "bg-green-50 text-green-700",
                },
                {
                  label: "Problem Solving",
                  value: average(problemScores),
                  style: "bg-purple-50 text-purple-700",
                },
              ];

              return (
                <div
                  key={id}
                  className="bg-white rounded-xl shadow p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {technology}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Interview ID: {id}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(date)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex self-start px-3 py-2 rounded-full text-sm font-semibold ${
                        status.toUpperCase() === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="mt-5 border-t pt-5">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">
                      Interview Results
                    </h3>

                    {feedback.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Scores and feedback are not included in the history
                        response for this interview.
                      </p>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {scores.map((score) => (
                            <div
                              key={score.label}
                              className={`rounded-lg p-4 ${score.style}`}
                            >
                              <p className="text-sm">{score.label}</p>
                              <p className="text-2xl font-bold mt-1">
                                {score.value === null
                                  ? "N/A"
                                  : `${score.value.toFixed(1)}/10`}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 bg-gray-50 border rounded-lg p-4">
                          <h4 className="font-bold text-blue-900 mb-2">
                            AI Feedback
                          </h4>

                          {messages.length > 0 ? (
                            messages.map((message, messageIndex) => (
                              <p
                                key={messageIndex}
                                className="text-gray-700 whitespace-pre-line mb-3"
                              >
                                {message}
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              Feedback text is not included in the history
                              response.
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;