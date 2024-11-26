"use client";

import React, { useEffect, useState } from "react";

interface RepositoriesProps {
  accessToken?: string;
  username?: string;
}

const Repositories: React.FC<RepositoriesProps> = ({
  accessToken = "",
  username = "YASH-RAJ-HANS",
}) => {
  const [repos, setRepos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const fetchRepos = async () => {
      if (!accessToken || !username) {
        // window.location.href = "http://localhost:3000";
        // return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "http://localhost:7001/api/v1-2024/github/user/repositories",
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
        setRepos(data);
      } catch (error: any) {
        setError(
          error.message || "An error occurred while fetching repositories"
        );
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, [accessToken, username]);

  if (isLoading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className=" bg-gray-900 flex flex-col items-center py-8 px-4 o">
      <div className="max-w-4xl w-full bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          {username ? `Repositories for ${username}` : "Repositories"}
        </h1>
        <div className="h-[90vh] space-y-4 overflow-y-auto pr-4">
          {repos.map((repo: any) => (
            <div
              key={repo.id}
              className="flex justify-between items-center p-4 bg-gray-700 border border-gray-600 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div>
                <p className="text-lg font-semibold text-white">{repo.name}</p>
                <p className="text-sm text-gray-400">
                  {repo.description || "No description available"}
                </p>
              </div>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 hover:scale-105 transform transition-transform"
              >
                View
              </a>
            </div>
          ))}
          {!repos.length && (
            <div className="text-gray-500 text-center">
              No repositories available. Please authenticate or ensure you have
              repositories.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Repositories;
