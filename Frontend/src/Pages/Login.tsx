
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import robo from "../Images/robo.png";
import api from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/signin", {
        email,
        password,
      });

      const { jwt, user, message } = response.data;

      if (!jwt) {
        throw new Error("The server did not return a JWT token.");
      }

      localStorage.setItem("token", jwt);
      localStorage.setItem("userEmail", user?.email || email);

      toast({
        title: message || "Login successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);

      toast({
        title:
          err.response?.status === 401
            ? "Invalid email or password."
            : err.response?.data?.message || "Login failed. Check your backend.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-sky-400 to-indigo-400 h-screen fixed w-full">
      <div className="flex justify-evenly items-center pl">
        <div>
          <img
            src={robo}
            alt="Interview assistant robot"
            className="drop-shadow-2xl w-11/12"
          />
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-96 p-10 border m-auto bg-white rounded-xl shadow-lg"
          >
            <h1 className="text-center text-4xl font-bold mb-7">
              Login
            </h1>

            <input
              type="email"
              placeholder="Email"
              className="p-2 rounded-lg text-lg bg-slate-200"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="p-2 rounded-lg text-lg bg-slate-200"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />

            <input
              type="submit"
              value={loading ? "Logging in..." : "Login"}
              disabled={loading}
              className="bg-sky-400 text-lg font-medium rounded-xl p-2 cursor-pointer text-white hover:bg-sky-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;