import clsx, { ClassValue } from "clsx";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line
export const Icons = {
  spinner: Loader2,
};

export type SpinnerProps = {
  className?: string;
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return <Icons.spinner className={cn(`h-[1.25rem] w-[1.25rem] animate-spin`, className)} />;
};

export default Spinner;
