"use client";

import React from "react";

const LoginWithGitHub = ({ title }: { title: string }) => {
  const loginWithGitHub = () => {
    const clientID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const baseURL = process.env.NEXT_PUBLIC_GITHUB_BASE_URL;
    const redirectURI = `${window.location.origin}/loginCallback`;
    window.location.href = `${baseURL}/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=repo,write:repo_hook`;
  };
  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-lg"
      onClick={loginWithGitHub}
    >
      {title}
    </button>
  );
};

export default LoginWithGitHub;
