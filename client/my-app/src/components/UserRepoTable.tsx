"use client"
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from './ui/button';
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
interface UserRepoTableProps {
  repos: Repository[];
  setRepoUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserRepoTable: React.FC<UserRepoTableProps> = ({ repos,setRepoUrl }) => {
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);

    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `${formattedDate} ${formattedTime}`;
  };
  if (!repos || repos.length === 0) {
    return <div>No repositories available.</div>;
  }

  return (
    <Table>
      <TableCaption>Latest Repos</TableCaption>
      <TableHeader className="text-zinc-100 py-6">
        <TableRow className="mb-4 ">
          <TableHead className="w-[100px] text-zinc-100 pl-[10px] mb-6">
            Repo
          </TableHead>
          <TableHead className="w-[500px] text-zinc-100 mb-6">
            Description
          </TableHead>
          <TableHead className="w-[80px] text-zinc-100 mb-6">
            Status
          </TableHead>
          <TableHead className="w-[150px] text-zinc-100 mb-6">Created</TableHead>
          <TableHead className="w-[150px] text-zinc-100 mb-6">
            Last Updated
          </TableHead>
          <TableHead className="text-right w-1/12 text-zinc-100 mb-6">
            Connection
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {repos.map((repo) => (
          <TableRow
            key={repo.id}
            className="my-4 text-gray-200 hover:bg-gray-800 cursor-pointer text-[15px] border-0"
          >
            <TableCell className="font-medium">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </TableCell>
            <TableCell>
              {repo.description || "No description available"}
            </TableCell>
            <TableCell>{repo.private ? "Private" : "Public"}</TableCell>
            <TableCell>{formatDate(repo.created_at)}</TableCell>
            <TableCell>{formatDate(repo.updated_at)}</TableCell>
            <TableCell className="text-right">
              
                <Button
                  className="w-full p-2 bg-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 text-zinc-50 border-zinc-600"
                  variant="outline"
                  size="lg"
                  onClick={()=>setRepoUrl(repo.html_url)}
                >
                  Connect
                </Button>
              
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserRepoTable;
