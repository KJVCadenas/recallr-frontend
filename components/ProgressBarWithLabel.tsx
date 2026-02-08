import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { cn } from "@/lib/frontend/utils";

interface ProgressWithLabelProps {
  label: string;
  value: number;
  max?: number;
  className?: string;
}

export function ProgressWithLabel({
  label,
  value,
  max = 100,
  className,
}: ProgressWithLabelProps) {
  return (
    <Progress value={value} max={max} className={cn("w-full", className)}>
      <ProgressLabel>{label}</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}
