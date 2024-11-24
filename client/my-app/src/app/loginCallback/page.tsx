"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [islongin, setIsLogin] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const access_token = localStorage.getItem("access_token");
    console.log("code->", code);
    if (code && !access_token) {
      fetch(`${baseUrl}/api/v1-2024/auth/githubCallback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        signal,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Backend response:", data);
          localStorage.setItem("access_token", data.accessToken);
          setIsLoading(false);
          setIsLogin(true);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error during GitHub login:", error);
        });
      return () => {
        controller.abort();
      };
    } else {
      setIsLoading(false);
      setIsLogin(true);
    }
  }, []);
  return (
    <div>
      {isloading && <p>Loading...</p>}
      {islongin && <p>GITHUB login successful</p>}
      {!isloading && !islongin && <p>Something went wrong</p>}
    </div>
  );
}
