import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface User {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
}

interface UserDropdownMenuProps {
  user: User;
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="w-8 h-8 md:w-10 md:h-10">
          {user?.image && <AvatarImage src={user?.image} />}
          {user?.name && !user?.image && (
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 dark:text-gray-300">
        <DropdownMenuItem className="text-xs md:text-sm">
          {user.email}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs md:text-sm">
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs md:text-sm">
          <Link
            href="/settings"
            className="flex items-center justify-between w-full"
          >
            Settings <SettingsIcon className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-xs md:text-sm flex items-center justify-between">
          Menu
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs md:text-sm">Ctrl K</span>
          </kbd>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-xs md:text-sm">
          <Link href="/" className="flex items-center justify-between w-full">
            Replit Homepage <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-xs md:text-sm cursor-pointer"
          onClick={() => {
            console.log("Logging out");
            signOut();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
