// ! this is our implementation of custom variant component(Spinner)
// ! look into components/ui/button.tsx to see how Actually components with variants are created

import { Loader } from "lucide-react";

// ! We want different variants of our Spinner
// ! cva is a function that takes a string of classes and returns a function that takes a variant object and returns a string of classes
// ! we can use it to create a function that takes a variant object and returns a string of classes
// ! this will help us create different variants of our Spinner
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("text-muted-foreground animate-spin", {
  variants: {
    size: {
      default: "h-4 w-4",
      sm: "h-2 w-2",
      lg: "h-6 w-6",
      ultra: "h-16 w-16",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {}

export const Spinner = ({ size }: SpinnerProps) => {
  return <Loader className={cn(spinnerVariants({ size }))} />;
};
