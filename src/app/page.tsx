import LoginButton from "@/components/auth/LoginButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-radial-[at_50%_00%] from-sky-400 to-blue-800">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-white text-6xl drop-shadow-md")}>
          📆 Calendify
        </h1>
        <p className="text-white text-lg">
          AI Powered Calendar Manager
        </p>
        <LoginButton mode="redirect">
          <Button >Sign In</Button>
        </LoginButton>
      </div>
    </main>
  );
}
