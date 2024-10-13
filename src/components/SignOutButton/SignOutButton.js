import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignOutButton = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // 로그아웃 후 홈 페이지 또는 로그인 페이지로 이동
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
