"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { time } from "console";

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
  currentPage: number;
}

const UserRepoTable: React.FC<UserRepoTableProps> = ({
  repos,
  currentPage,
}) => {
  const router = useRouter();

  const handleConnect = (repoUrl: string) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("repo", repoUrl);

    router.push(currentUrl.toString());
  };
  function calculateTimeAgo(updatedAt: string): string {
    const now = new Date();
    const updatedAtDate = new Date(new Date(updatedAt).getTime() + 5.5 * 60 * 60 * 1000);
    const diff = now.getTime() - updatedAtDate.getTime(); 
  
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
  
    if (years > 0) return `${years}yr ago`;
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `just now`;
  }
  const timeDifference = (time: string): string => {
    return calculateTimeAgo(time);
  };
  

  return (
    <Table>
      <TableCaption>Latest Repos</TableCaption>
      <TableHeader className="text-zinc-100 ">
        <TableRow className="mb-4 hover:bg-zinc-900 border-4 border-zinc-900 rounded-[4px]">
          <TableHead className="w-[100px] text-zinc-100 pl-4 mb-6">
            Repository
          </TableHead>
          <TableHead className="text-right w-1/12 text-zinc-100 mb-6 pr-4 py-4">
            Connection
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {repos.map((repo: Repository, index: number) => (
          
          <TableRow
            key={repo.id}
            className="my-4 text-gray-200 hover:bg-zinc-900 cursor-pointer text-[15px] border-[2px] border-gray-900 p-6 rounded-lg"
          >
            <TableCell className="font-medium pl-4 text-wrap">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {(currentPage - 1) * 30 + index + 1}. <span className="font-bold text-md">{repo.name}</span>  <span className="ml-2 text-sm text-gray-400 font-thin">{timeDifference(repo.updated_at)}</span>
              </a>
            </TableCell>
            <TableCell className="text-right pr-4">
              <Button
                className="w-full p-2 bg-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 text-zinc-50 border-zinc-600"
                variant="outline"
                size="lg"
                onClick={() => handleConnect(repo.html_url)}
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
