import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "./Profile.css";

export default function Profile() {

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if(passwords.newPassword !== passwords.confirmPassword){
      return toast.error("Passwords do not match!");
    }

    try{
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/auth/update-password",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Password Updated!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    }catch(err){
      toast.error("Failed to update");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="profilePage">

      <div className="profileGrid">

        {/* PROFILE CARD */}

        <div className="profileCard">

          <div className="avatarCircle">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <h3>{user?.name}</h3>
          <p className="email">{user?.email}</p>

          <span className="roleTag">
            {user?.role?.toUpperCase()}
          </span>

          <div className="infoBlock">
            <label>Department</label>
            <span>CSA Department</span>
          </div>

        </div>

        {/* SECURITY */}

        <div className="securityCard">

          <h3>Change Password</h3>

          <form onSubmit={handlePasswordChange}>

            <div className="inputGroup">
              <label>Current Password</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e)=>setPasswords({...passwords,currentPassword:e.target.value})}
                required
              />
            </div>

            <div className="inputGroup">
              <label>New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e)=>setPasswords({...passwords,newPassword:e.target.value})}
                required
              />
            </div>

            <div className="inputGroup">
              <label>Confirm Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e)=>setPasswords({...passwords,confirmPassword:e.target.value})}
                required
              />
            </div>

            <button type="submit" className="updateBtn" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
