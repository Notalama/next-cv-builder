import { Input } from "@/components/ui/input";
import type { NumberInputProps } from "@/models/ui";

export function NumberInput({ onChange, value, ...props }: NumberInputProps) {
  return (
    <Input
      {...props}
      onChange={(event) => {
        const number = event.target.valueAsNumber;
        onChange(Number.isNaN(number) ? null : number);
      }}
      value={value ?? ""}
      type="number"
    />
  );
}
