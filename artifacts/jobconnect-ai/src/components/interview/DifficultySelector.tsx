import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function DifficultySelector({
  value,
  onChange,
}: Props) {

  return (

    <Select
      value={value}
      onValueChange={onChange}
    >

      <SelectTrigger>

        <SelectValue placeholder="Difficulty"/>

      </SelectTrigger>

      <SelectContent>

        <SelectItem value="Easy">
          Easy
        </SelectItem>

        <SelectItem value="Medium">
          Medium
        </SelectItem>

        <SelectItem value="Hard">
          Hard
        </SelectItem>

      </SelectContent>

    </Select>

  );

}