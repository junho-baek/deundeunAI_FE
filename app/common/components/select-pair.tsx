import { useState } from "react";
import { Label } from "~/common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import { cn } from "~/lib/utils";

export type SelectPairProps = {
  label: string;
  description: string;
  name: string;
  required?: boolean;
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
  defaultValue?: string;
  className?: string;
};

export default function SelectPair({
  name,
  required,
  label,
  description,
  placeholder,
  options,
  defaultValue,
  className,
}: SelectPairProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("space-y-2 flex flex-col w-full", className)}>
      <Label className="flex flex-col gap-1" onClick={() => setOpen(true)}>
        {label}
        <small className="text-muted-foreground">{description}</small>
      </Label>
      <Select
        open={open}
        onOpenChange={setOpen}
        name={name}
        required={required}
        defaultValue={defaultValue}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

