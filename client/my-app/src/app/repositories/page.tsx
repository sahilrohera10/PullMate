"use client";

import React, { useEffect, useState } from "react";
import UserRepoTable from "@/components/UserRepoTable";
import Pagination from "@/components/Pagination";
import Workflow from "@/components/Workflow";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  language: string | null;
  created_at: string;
  updated_at: string;
}

const Repositories = ({}) => {
  const [repos, setRepos] = useState<Repository[]>([]); // Initial state as empty array
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user_name");
    setUsername(user);
    setAccessToken(token);
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${baseUrl}/api/v1-2024/github/user/repositories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: access_token,
              user_name: username,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch repositories: ${response.statusText}`
          );
        }

        const data = await response.json();
        if (data) setRepos(data);
      } catch (error: any) {
        setError(
          error.message || "An error occurred while fetching repositories"
        );
      } finally {
        setIsLoading(false);
      }
      console.log("body", username, access_token);
    };
    if (username && access_token) {
      fetchRepos();
    }
  }, [access_token, username, baseUrl, currentPage]);
  if (error || access_token === null || username === null) {
    return (
      <div className=" bg-zinc-900 w-full h-screen">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex justify-around p-4 px-8 my-auto h-screen relative">
      <div className="max-w-2xl w-full bg-black border-zinc-800 rounded-xl shadow-lg  h-[600px] mt-20">
        <h1 className="text-2xl font-bold text-white mb-6 p-8 border-b-4 border-zinc-900">
          {username} Repositories
        </h1>
        <div className="h-[400px] w-full space-y-4 overflow-y-auto mb-4 px-8 p-6 pt-0 custom-scrollbar ">
          {isLoading ? (
            <div className=" bg-zinc-900 w-full ">
              <div className="text-center text-gray-100 p-12">Loading...</div>
            </div>
          ) : (
            <>
              <UserRepoTable repos={repos} currentPage={currentPage} />
              {!repos.length && (
                <div className="text-gray-500 text-center">
                  No repositories available. Please authenticate or ensure you
                  have repositories.
                </div>
              )}
            </>
          )}
        </div>

        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>

      <Workflow />
    </div>
  );
};

export default Repositories;
