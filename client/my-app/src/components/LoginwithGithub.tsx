'use client';

import React from 'react';

const LoginWithGitHub: React.FC = () => {
    const loginWithGitHub = () => {
        const clientID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        const redirectURI = `${window.location.origin}/loginCallback`;
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
    };

    return (
        <button onClick={loginWithGitHub}>
            Login with GitHub
        </button>
    );
};

export default LoginWithGitHub;