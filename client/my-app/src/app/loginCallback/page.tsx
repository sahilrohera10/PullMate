'use client'
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log("code->" ,code);
        if (code) {
            fetch('http://localhost:7001/api/v1-2024/auth/githubCallback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
                signal,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Backend response:', data);
                    localStorage.setItem("access_token", data.accessToken);
                })
                .catch((error) => {
                    console.error('Error during GitHub login:', error);
                });
                return () => {
                    controller.abort();  
                };
        }
    }, [window.location.search]);
    return (
      <div >
         GITHUB login successful
      </div>
    );
  }
  
