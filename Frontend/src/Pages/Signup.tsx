
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";

interface SignupFormData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  password: string;
}

interface SignupResponse {
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    mobileNumber?: string;
  };
  jwt?: string;
  message?: string;
}

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();
    const mobileNumber = formData.mobileNumber.trim();

    if (firstName.length < 2 || firstName.length > 20) {
      setError("First name must contain 2–20 characters.");
      return;
    }

    if (lastName.length < 2 || lastName.length > 20) {
      setError("Last name must contain 2–20 characters.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post<SignupResponse>(
        "/auth/signup",
        {
          firstName,
          lastName,
          email,
          mobileNumber,
          password: formData.password,
        }
      );

      const data = response.data;

      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
      }

      if (data.user?.email) {
        localStorage.setItem("userEmail", data.user.email);
      }

      setSuccess(data.message || "Account created successfully!");

      // Redirect only after a successful signup response.
      window.setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err: unknown) {
      const error = err as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };

      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.response?.data?.error;

      if (status === 400) {
        setError(message || "Please check your signup details.");
      } else if (status === 409) {
        setError("This email is already registered. Please log in.");
      } else if (status === 500) {
        setError(
          message ||
            "Server error while creating your account. Check the backend terminal."
        );
      } else {
        setError(message || "Signup failed. Please try again.");
      }

      console.error("Signup failed:", status, message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-5 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-2">Sign Up</h2>

        {error && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="mb-3 text-sm text-green-600">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label htmlFor="firstName" className="block text-gray-600">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full border rounded p-2"
              value={formData.firstName}
              onChange={handleChange}
              minLength={2}
              maxLength={20}
              required
            />
          </div>

          <div className="mb-1">
            <label htmlFor="lastName" className="block text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full border rounded p-2"
              value={formData.lastName}
              onChange={handleChange}
              minLength={2}
              maxLength={20}
              required
            />
          </div>

          <div className="mb-1">
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border rounded p-2"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-1">
            <label htmlFor="mobileNumber" className="block text-gray-600">
              Mobile
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              className="w-full border rounded p-2"
              value={formData.mobileNumber}
              onChange={handleChange}
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              required
            />
          </div>

          <div className="mb-1">
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border rounded p-2"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;