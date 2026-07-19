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

const companies = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Adobe",
  "Oracle",
  "Netflix",
  "Apple",
  "Uber",
  "Goldman Sachs",
  "TCS",
  "Infosys",
  "Wipro",
  "Accenture",
];

export default function CompanySelector({
  value,
  onChange,
}: Props) {

  return (

    <Select
      value={value}
      onValueChange={onChange}
    >

      <SelectTrigger>

        <SelectValue placeholder="Choose Company"/>

      </SelectTrigger>

      <SelectContent>

        {companies.map((company) => (

          <SelectItem
            key={company}
            value={company}
          >

            {company}

          </SelectItem>

        ))}

      </SelectContent>

    </Select>

  );

}