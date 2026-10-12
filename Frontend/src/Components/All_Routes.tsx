
import React from "react";
import { Routes, Route } from "react-router-dom";

import Category from "../Pages/Category";
import InterviewHistory from "../Components/InterviewHistory";
import Performance from "../Components/Performance";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import ProtectedRoute from "../Components/ProtectedRoute";

import Speech2 from "./Speech2";
import EndInterview from "./EndInterview";

const All_Routes = () => {
  return (
    <div>
      <Routes>

        {/* Public Routes */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* Protected Routes */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />

        <Route
          path="/section/:tech"
          element={
            <ProtectedRoute>
              <Speech2 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-history"
          element={
            <ProtectedRoute>
              <InterviewHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/performance"
          element={
            <ProtectedRoute>
              <Performance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/endinterview"
          element={
            <ProtectedRoute>
              <EndInterview />
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  );
};

export default All_Routes;