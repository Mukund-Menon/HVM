import React, { useState } from "react";
import bg from "src/assets/back.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader/loader";
import { FormData } from "registerformDataTypes";

const API = process.env.REACT_APP_API_URL


export default function Page() {
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    password2: "",
    email: "",
    contact_number: "",
    employee_id: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "password" || name === "password2") {
      const updatedPassword = name === "password" ? value : formData.password;
      const updatedPassword2 = name === "password2" ? value : formData.password2;
  
      setPasswordsMatch(updatedPassword === updatedPassword2);
    }
  };

  const postData = async () => {
    if (!passwordsMatch) {
      toast.error("Passwords don't match!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: "UUIDerr",
      });
      return;
    }
    const token = localStorage.getItem("access_token");
    try {
      setLoading(true);
      const response = await axios.post(
        `${API}/register/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      window.location.href = "/home";
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div
      className="bg-back-login h-screen"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex items-center justify-center h-full w-full bg-no-repeat bg-cover bg-center">
        <div className="flex bg-white/40 h-[50rem] w-[50rem] rounded-3xl shadow-xl backdrop-blur-sm px-5">
          <form
            onSubmit={(e) => {
              postData();
              e.preventDefault();
            }}
            className="flex flex-col w-full justify-center items-center p-10"
          >
            <h1 className="text-3xl font-bold">Register a new user</h1>
            <br />
            <br />
            <div className="flex flex-row gap-11 w-full mb-3 justify-center items-center">
              
              <div className="flex flex-col gap-11">
                <input
                  required
                  name="first_name"
                  className="h-16 text-xl w-full p-5 rounded-lg"
                  placeholder="First Name"
                  onChange={handleInputChange}
                ></input>
                <input
                  name="last_name"
                  required
                  className="h-16 text-xl w-full p-5 rounded-lg"
                  placeholder="Last Name"
                  onChange={handleInputChange}
                ></input>
                <input
                  name="username"
                  required
                  className="h-16 text-xl w-full p-5 rounded-lg"
                  placeholder="Username"
                  onChange={handleInputChange}
                ></input>
                <input
                  name="password"
                  required
                  className="h-16 text-xl w-full p-5 rounded-lg"
                  placeholder="Password"
                  type="password"
                  onChange={handleInputChange}
                ></input>
                <input
                  name="password2"
                  required
                  className="h-16 text-xl w-full p-5 rounded-lg"
                  placeholder="Confirm Password"
                  type="password"
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="flex flex-col gap-11 rounded-lg h-full">
                <input
                  required
                  name="email"
                  className="h-16 text-xl w-full p-5 rounded-lg"
                  placeholder="Email"
                  onChange={handleInputChange}
                ></input>
                <input
                  name="contact_number"
                  required
                  className="h-16 text-xl w-full p-5 rounded-lg"
                  placeholder="Contact Number"
                  onChange={handleInputChange}
                ></input>
                <input
                  name="employee_id"
                  required
                  className="h-16 text-xl w-full p-5 rounded-lg"
                  placeholder="Employee ID"
                  onChange={handleInputChange}
                ></input>
              </div>
            </div>
            <br />
            <button
              type="submit"
              className="bg-[#f58220] w-40 text-white h-16 rounded-3xl font-bold text-xl p-3"
            >
              Register
            </button>
            <br />
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
