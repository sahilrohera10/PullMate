"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RepoCard } from "@/components/RepoCard";

type WorkflowResponse = {
  message: string;
  data: Array<{
    workflow_id: string;
    repo_name: string;
    repo_url: string;
    user_id: string;
    owner_name: string;
    additional_email: string,
    no_of_prs: string,
    no_of_reviews: string | boolean;
    created_at: string | number;
  }>;
};


export default function Home() {
  const router = useRouter,
  const [islogin, setIsLogin] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  const [workflows, setWorkflows] = useState<WorkflowResponse['data']>([]);

  const handleRedirect = () => {
    router.push("/repositories"); // Redirect to the defetchReposAndWorkflowssired URL
  };


  useEffect(() => {
    const fetchUserWorkflows = async () => {
      const userId =  "f56e1d58-b104-4451-9c9e-e617fdf38f0d" 
      const access_token = localStorage.getItem("access_token");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
      const workflowsResponse = await fetch(
        `${baseUrl}/api/v1-2024/workflow/${userId}`,
        {
          headers: {
            Authorization: "Bearer ${access_token}"
          }
        }
      );
      
      const workflowsData = await workflowsResponse.json();
      setWorkflows(workflowsData.data);


    };
  
    fetchUserWorkflows();
  }, []);


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
          localStorage.setItem(
            "user_id",
            data.user_insert_response.user_id
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
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {isloading && (
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl">Loading...</p>
        </div>
      )}
  
      {islogin && (
        <>
          <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold">Welcome {localStorage.getItem('user_name') || 'Mate'}!</h1>
            <Button
              variant="ghost"
              onClick={handleRedirect}
              className="text-sm hover:bg-gray-800"
            >
              + Create New
            </Button>
          </header>
  
          <nav className="flex justify-center gap-8 py-4 border-b border-gray-700 text-gray-400">
            <button className="hover:text-white transition-colors">Home</button>
            <button className="hover:text-white transition-colors">Settings</button>
            <button className="hover:text-white transition-colors">Profile</button>
          </nav>
  
          <main className="flex-grow p-8">
            {workflows.length === 0 ? (
              <div className="flex h-full items-center justify-center flex-col">
                <div className="w-20 h-20 border border-gray-700 rounded-full flex items-center justify-center mb-6 hover:border-gray-500 transition-colors">
                  <span className="text-3xl font-bold">+</span>
                </div>
                <p className="text-gray-400 text-center">
                  Create your first workflow for streamlined PR reviews
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows && workflows.map((workflow) => (
                  <RepoCard 
                    key={workflow.workflow_id} 
                    repo={workflow}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}
  
      {!isloading && !islogin && (
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500">Something went wrong. Please try again.</p>
        </div>
      )}
    </div>
  );
}  
