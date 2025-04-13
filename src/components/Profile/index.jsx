import React, { useEffect, useState } from "react";
import "./Profile.css";
import SocialProfile from "../ProfileComponent/SocialProfile";
import ProfileCard from "../ProfileComponent/ProfileCard";
import ProfileHeader from "./ProfileHeader";
import { auth } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/");
      }
    });
  }, []);

  const toggleProfile = () => {
    setOpen(!open);
  };

  return (
    <div className="profile-body">
      <ProfileHeader toggleProfile={toggleProfile}>
        <ProfileCard open={open} user={user} />
        <SocialProfile />
      </ProfileHeader>
    </div>
  );
}
