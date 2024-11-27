"use client"
import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WorkflowProps {
  access_token: string | null;
  repo_url: string | null;
}

export default function Workflow({ access_token, repo_url }: WorkflowProps) {

  const [showEmailInput, setShowEmailInput] = useState(false)
  const [email, setEmail] = useState('')
  const [isDeploying, setIsDeploying] = useState(false)
  const [repoName, setRepoName] = useState<string | null>(null)
  const [owner, setOwner] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const user_id = localStorage.getItem('user_id') || ''

  const repoNameFromUrl = new URLSearchParams(window.location.search).get('repoName')

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const extractOwnerAndRepo = (repoUrl: string) => {
    const url = new URL(repoUrl);
    const pathParts = url.pathname.split('/'); 
    
    const owner = pathParts[1]; 
    const repoName = pathParts[2]; 
    
    return { owner, repoName };
  };

  useEffect(() => {
    if (repo_url) {
      const { owner, repoName } = extractOwnerAndRepo(repo_url);
      setOwner(owner);
      setRepoName(repoName);
    }
  }, [repo_url]);

  useEffect(() => {
    if (repoNameFromUrl) {
      setRepoName(repoNameFromUrl)
    }
  }, [repoNameFromUrl])

  const handleDeploy = async () => {
    setIsDeploying(true)
    const payload = {
      owner,
      repo: repoName,
      access_token,
      additional_email: email,
      repo_url,
      user_id
    }
    console.log("Payload Body",payload);
    console.log("Repo Url:",repo_url);
    try {
      const response = await fetch(`${baseUrl}/api/v1-2024/github/register/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      if (!response.ok) {
        throw new Error('Failed to register webhook')
      }
      console.log('Webhook registered successfully')
    } catch (error) {
      console.error('Deployment Error:', error)
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="max-h-[400px] w-[25vw]">
      <Card className="bg-zinc-950/50 border-zinc-800 p-8 max-w-md w-full space-y-8">
        <div className="space-y-6">
          <div className="relative">
            <div className="border border-zinc-800 rounded-lg p-4 flex items-center justify-between bg-zinc-950/50">
              <span className="text-l text-zinc-200">{repoName} Connected</span>
              <span className="bg-green-500/10 p-1 rounded">
                <Check className="w-5 h-5 text-green-500" />
              </span>
            </div>
            <div className="absolute left-1/2 -bottom-8 w-0.5 h-8 bg-zinc-800" />
          </div>

          <div className="relative">
            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950/50 flex -items justify-between items-center">
              <span className="text-l text-zinc-200">Comment on PR</span>
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-200 ">
                Default
              </Badge>
            </div>
            <div className="absolute left-1/2 -bottom-8 w-0.5 h-8 bg-zinc-800" />
          </div>

          <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950/50">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowEmailInput(!showEmailInput)}
            >
              <span className="text-l text-zinc-200">Add Email ID</span>
            </div>
            {showEmailInput && (
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmail}
                className="mt-4 bg-zinc-900 border-zinc-700 text-zinc-200"
              />
            )}
          </div>

          <Button
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
            variant="outline"
            size="lg"
            onClick={handleDeploy}
            disabled={isDeploying}
          >
            {isDeploying ? 'Deploying...' : 'Deploy Workflow'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
