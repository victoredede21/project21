import { FC } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Lock, Menu, Settings } from "lucide-react";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <header className="bg-dark-400 border-b border-dark-300 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Lock className="h-8 w-8 text-primary-500" />
          <Link href="/">
            <a className="ml-2 text-xl font-bold tracking-tight">
              HackAssist<span className="text-primary-500">AI</span>
            </a>
          </Link>
        </div>
        <div className="flex space-x-3">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
