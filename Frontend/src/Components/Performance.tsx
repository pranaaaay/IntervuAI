
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
  completedAt?: string;
  feedBackList?: Feedback[];
  feedBacks?: Feedback[];
  feedbacks?: Feedback[];
  feedback?: Feedback | Feedback[];
  feedBack?: Feedback | Feedback[];
  [key: string]: any;
}

const Performance = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPerformance = async () => {
      const email = localStorage.getItem("userEmail");

      if (!email) {
        setError("Please log in to view your performance.");
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

        console.log("Performance history response:", records);
        setInterviews(records);
      } catch (err: any) {
        console.error(
          "Failed to load performance:",
          err.response?.data || err.message
        );

        setError(
          err.response?.status === 401 ||
            err.response?.status === 403
            ? "Your session may have expired. Please log in again."
            : "Unable to load performance. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
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

  const getAverage = (values: number[]): number | null => {
    if (values.length === 0) return null;

    return (
      values.reduce((total, value) => total + value, 0) /
      values.length
    );
  };

  const getScore = (
    feedback: Feedback[],
    field: "subject" | "communication" | "problemSolving"
  ): number | null => {
    const values = feedback
      .map((item) => {
        if (field === "subject") {
          return item.subjectExperties ?? item.subjectExpertise;
        }

        if (field === "communication") {
          return item.communicationSkill;
        }

        return item.problemSolving;
      })
      .filter(
        (value): value is number =>
          typeof value === "number" && Number.isFinite(value)
      );

    return getAverage(values);
  };

  const results = interviews.map((interview, index) => {
    const feedback = getFeedback(interview);

    const subject = getScore(feedback, "subject");
    const communication = getScore(feedback, "communication");
    const problemSolving = getScore(feedback, "problemSolving");

    const average = getAverage(
      [subject, communication, problemSolving].filter(
        (value): value is number => value !== null
      )
    );

    const messages = feedback
      .map(
        (item) =>
          item.feedBackMessage ??
          item.feedbackMessage ??
          item.aiFeedback
      )
      .filter(
        (message): message is string =>
          typeof message === "string" && message.trim().length > 0
      );

    return {
      id: interview.id ?? interview.interviewId ?? index,
      technology: interview.technology ?? interview.tech ?? "Interview",
      status: interview.status ?? "Unknown",
      date:
        interview.interviewDate ??
        interview.completedAt ??
        interview.createdAt,
      subject,
      communication,
      problemSolving,
      average,
      messages,
    };
  });

  const completedCount = interviews.filter(
    (item) => item.status?.toUpperCase() === "COMPLETED"
  ).length;

  const overallAverage = getAverage(
    results
      .map((item) => item.average)
      .filter((value): value is number => value !== null)
  );

  const formatDate = (value?: string) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 text-center">
        <p className="text-lg text-gray-600">Loading performance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Performance Dashboard
        </h1>

        <p className="text-gray-600 mb-8">
          Review your interview scores and AI feedback.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {!error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500 text-sm">Total Interviews</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {interviews.length}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500 text-sm">Completed Interviews</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {completedCount}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500 text-sm">Average Score</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {overallAverage === null
                    ? "N/A"
                    : `${overallAverage.toFixed(1)}/10`}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-5">
                Interview Scores and Feedback
              </h2>

              {results.length === 0 ? (
                <p className="text-gray-600 text-center py-6">
                  No interview data available yet.
                </p>
              ) : (
                <div className="space-y-5">
                  {results.map((item) => (
                    <div key={item.id} className="border rounded-lg p-5">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {item.technology}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Interview ID: {item.id}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(item.date)}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600">
                          {item.status}
                        </span>
                      </div>

                      {item.average === null ? (
                        <p className="text-sm text-gray-500">
                          Scores are not included in this history response.
                        </p>
                      ) : (
                        <>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Overall average</span>
                            <strong>{item.average.toFixed(1)}/10</strong>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-3 mb-5">
                            <div
                              className="bg-blue-600 h-3 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(0, item.average * 10)
                                )}%`,
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600">
                                Subject Expertise
                              </p>
                              <p className="text-2xl font-bold text-blue-700">
                                {item.subject === null
                                  ? "N/A"
                                  : `${item.subject.toFixed(1)}/10`}
                              </p>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600">
                                Communication
                              </p>
                              <p className="text-2xl font-bold text-green-700">
                                {item.communication === null
                                  ? "N/A"
                                  : `${item.communication.toFixed(1)}/10`}
                              </p>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600">
                                Problem Solving
                              </p>
                              <p className="text-2xl font-bold text-purple-700">
                                {item.problemSolving === null
                                  ? "N/A"
                                  : `${item.problemSolving.toFixed(1)}/10`}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="mt-5 bg-gray-50 border rounded-lg p-4">
                        <h4 className="font-bold text-blue-900 mb-2">
                          AI Feedback
                        </h4>

                        {item.messages.length > 0 ? (
                          item.messages.map((message, index) => (
                            <p
                              key={index}
                              className="text-gray-700 whitespace-pre-line mb-3"
                            >
                              {message}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            Feedback is not included in the history response.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Performance;