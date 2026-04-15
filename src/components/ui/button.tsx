import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button relative isolate inline-flex overflow-hidden rounded-xl text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(120deg,transparent_18%,rgba(255,255,255,0.16)_48%,transparent_78%)] before:translate-x-[-150%] before:opacity-0 before:transition-[transform,opacity] before:duration-700 before:ease-out hover:before:translate-x-[150%] hover:before:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "inline-flex items-center justify-center gap-2 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "inline-flex items-center justify-center gap-2 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "inline-flex items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground",
        link: "inline-flex items-center justify-center gap-2 text-primary underline-offset-4 hover:underline",
        terminalLink:
          "inline-flex min-h-11 items-center justify-center gap-2 border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,32,0.98),rgba(9,13,18,0.98))] px-4 text-foreground shadow-[0_14px_34px_-24px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-1 hover:border-primary/65 hover:bg-[linear-gradient(180deg,rgba(22,30,42,1),rgba(11,16,24,1))] hover:shadow-[0_24px_44px_-22px_rgba(135,175,240,0.38),0_18px_40px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] active:translate-y-0",
        terminalInline:
          "inline-flex items-center justify-start gap-2 overflow-visible rounded-none bg-transparent px-0 py-0 text-sm text-primary shadow-none before:hidden hover:translate-x-1 hover:bg-transparent hover:text-foreground",
        terminalSurface:
          "border border-white/10 bg-[linear-gradient(180deg,rgba(14,19,27,0.98),rgba(10,14,20,0.98))] text-foreground shadow-[0_18px_38px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-1 hover:border-primary/65 hover:bg-[linear-gradient(180deg,rgba(18,25,35,1),rgba(11,16,24,1))] hover:shadow-[0_26px_54px_-28px_rgba(135,175,240,0.34),0_18px_34px_-26px_rgba(0,0,0,0.98),inset_0_1px_0_rgba(255,255,255,0.1)] active:translate-y-0",
        dashboardRow:
          "border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,33,0.95),rgba(10,14,19,0.95))] text-muted-foreground shadow-[0_16px_34px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-1 hover:border-primary/55 hover:bg-[linear-gradient(180deg,rgba(23,31,43,0.98),rgba(12,17,24,0.98))] hover:text-foreground hover:shadow-[0_24px_48px_-24px_rgba(135,175,240,0.28),0_12px_30px_-24px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.1)] active:translate-y-0",
        terminalIcon:
          "inline-flex items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,33,0.98),rgba(10,14,19,0.98))] text-muted-foreground shadow-[0_14px_30px_-22px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-1 hover:border-primary/65 hover:bg-[linear-gradient(180deg,rgba(24,33,45,0.98),rgba(12,18,26,0.98))] hover:text-foreground hover:shadow-[0_22px_42px_-18px_rgba(135,175,240,0.35),0_16px_32px_-24px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] active:translate-y-0",
        commandMenu:
          "grid w-full rounded-none border-0 bg-transparent px-4 py-2 text-left shadow-none before:hidden hover:text-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "inline-flex h-10 w-10 items-center justify-center",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
