"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [islogin, setIsLogin] = useState(false);
  const [isloading, setIsLoading] = useState(true);

  const handleRedirect = () => {
    router.push("/repositories"); // Redirect to the desired URL
  };

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
          localStorage.setItem(
            "user_name",
            data.user_insert_response.user_name
          );
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
    <div className="bg-gray-900 text-white min-h-screen">
      <div>
        {isloading && <p>Loading...</p>}
        {islogin && (
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
              <h1 className="text-2xl font-bold">Welcome Mate !!</h1>
              <Button
                variant="ghost"
                onClick={handleRedirect}
                className="text-sm"
              >
                + Create New
              </Button>
            </header>

            {/* Navigation */}
            <nav className="flex justify-center items-left gap-8 py-4 border-b border-gray-700 text-gray-400">
              <button className="hover:text-white">Home</button>
              <button className="hover:text-white">Settings</button>
              <button className="hover:text-white">Profile</button>
            </nav>

            {/* Content */}
            <div className="flex flex-grow items-center justify-center flex-col">
              <div className="w-20 h-20 border border-gray-700 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold">+</span>
              </div>
              <p className="text-gray-400 text-center">
                Create your first companion for streamlined PR reviews
              </p>
            </div>
          </div>
        )}
        {!isloading && !islogin && <p>Something went wrong</p>}
      </div>
    </div>
  );
}
