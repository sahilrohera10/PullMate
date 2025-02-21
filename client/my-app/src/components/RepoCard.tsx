"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import Link from "next/link";

interface RepoCardProps {
  repo: {
    workflow_id: string;
    repo_name: string;
    repo_url: string;
    no_of_reviews: string;
    created_at: string;
  };
}

export const RepoCard = ({ repo }: RepoCardProps) => {
  return (
    <Card className="max-w-sm bg-zinc-950 text-zinc-100 shadow-xl rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out border border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-medium truncate flex-1">
            {repo.repo_name}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 p-0 hover:bg-zinc-800"
            asChild
          >
            <Link href={repo.repo_url} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 text-zinc-400 hover:text-zinc-100" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <Separator className="bg-zinc-800 mb-4" />

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Created : </span>
          <span className="text-zinc-300">{new Date(repo.created_at).toLocaleDateString()}</span>
        </div>

        <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 transition-colors">
          {repo.no_of_reviews} PRs Reviewed
        </Badge>
      </CardContent>
    </Card>
  );
};
