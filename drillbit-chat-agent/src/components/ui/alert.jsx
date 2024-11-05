import { cva } from "class-variance-authority";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = ({ className, variant, ...props }) => (
  <div
    role="alert"
    className={alertVariants({ variant, className })}
    {...props}
  />
);

const AlertTitle = ({ className, ...props }) => (
  <p
    className={`mb-1 font-medium leading-none tracking-tight ${className}`}
    {...props}
  />
);

const AlertDescription = ({ className, ...props }) => (
  <div
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
);

export { Alert, AlertTitle, AlertDescription };