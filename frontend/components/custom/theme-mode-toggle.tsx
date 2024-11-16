"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export const ThemeModeToggle = () => {
  // const { theme, setTheme } = useTheme();
  const { setTheme } = useTheme();

  return (
    <div>
      <Select
        onValueChange={(value) => {
          setTheme(value);
        }}
      >
        <SelectTrigger className="h-8 md:h-10">
          <Sun className="mr-1 h-4 w-4 md:h-5 md:w-5 block dark:hidden" />
          <Moon className="mr-1 h-4 w-4 md:h-5 md:w-5 hidden dark:block" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light" className="text-xs md:text-sm">
            Light
          </SelectItem>
          <SelectItem value="dark" className="text-xs md:text-sm">
            Dark
          </SelectItem>
          <SelectItem value="system" className="text-xs md:text-sm">
            System
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
