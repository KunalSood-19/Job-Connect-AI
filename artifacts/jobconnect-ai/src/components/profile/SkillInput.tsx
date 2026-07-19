import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SkillInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillInput({
  value,
  onChange,
}: SkillInputProps) {
  const [skill, setSkill] = useState("");

  const addSkill = () => {
    const trimmed = skill.trim();

    if (!trimmed) return;

    if (value.includes(trimmed)) {
      setSkill("");
      return;
    }

    onChange([...value, trimmed]);

    setSkill("");
  };

  const removeSkill = (remove: string) => {
    onChange(value.filter((s) => s !== remove));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add Skill..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
        />

        <Button
          type="button"
          onClick={addSkill}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No skills added yet.
          </p>
        )}

        {value.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1 text-sm"
          >
            {skill}

            <button
              type="button"
              onClick={() => removeSkill(skill)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}