import { useState } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CompanySelector from "@/components/interview/CompanySelector";
import DifficultySelector from "@/components/interview/DifficultySelector";
import { startInterview } from "@/api/aiInterview";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";

import {
  Brain,
  Loader2,
  PlayCircle,
} from "lucide-react";



export default function InterviewHome() {

  const [, navigate] = useLocation();

  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState("Frontend Developer");

  const [difficulty, setDifficulty] = useState("Medium");
const [questions, setQuestions] = useState("5");
const [company, setCompany] = useState("Google");

const [timePerQuestion, setTimePerQuestion] = useState("300");
  const [type, setType] = useState("Technical");



  const handleStart = async () => {
    try {

      setLoading(true);



        
const data = await startInterview({
  role,
  difficulty,
  company,
  interviewType: type,
  timePerQuestion: Number(timePerQuestion),
  totalQuestions: Number(questions),
});

console.log("START RESPONSE:", data);

sessionStorage.setItem(
  "interviewSession",
  JSON.stringify(data)
);

console.log(
  "SAVED:",
  sessionStorage.getItem("interviewSession")
);

navigate("/interview/session");
    } catch (err) {
      console.error(err);
      alert("Unable to start interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">

      <div className="max-w-3xl mx-auto">

        <Card>

          <CardHeader>

            <div className="flex items-center gap-3">

              <Brain className="w-10 h-10 text-violet-600" />

              <div>

                <CardTitle className="text-3xl">

                  AI Interview Practice

                </CardTitle>

                <p className="text-muted-foreground mt-1">

                  Practice company-level interviews powered by AI.

                </p>

              </div>

            </div>

          </CardHeader>

          <CardContent className="space-y-8">

            {/* Role */}

            <div>

              <Label>

                Job Role

              </Label>

              <Input
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                placeholder="Frontend Developer"
              />

            </div>

            {/* Interview Type */}

            <div>

              <Label>

                Interview Type

              </Label>

              <RadioGroup
                className="grid grid-cols-3 gap-4 mt-3"
                value={type}
                onValueChange={setType}
              >

                <div className="border rounded-lg p-4">

                  <RadioGroupItem
                    value="Technical"
                    id="technical"
                  />

                  <Label
                    htmlFor="technical"
                    className="ml-2"
                  >
                    Technical
                  </Label>

                </div>

                <div className="border rounded-lg p-4">

                  <RadioGroupItem
                    value="HR"
                    id="hr"
                  />

                  <Label
                    htmlFor="hr"
                    className="ml-2"
                  >
                    HR
                  </Label>

                </div>

                <div className="border rounded-lg p-4">

                  <RadioGroupItem
                    value="Resume"
                    id="resume"
                  />

                  <Label
                    htmlFor="resume"
                    className="ml-2"
                  >
                    Resume Based
                  </Label>

                </div>

              </RadioGroup>

            </div>

            {/* Difficulty */}

<div>

  <Label>

    Difficulty

  </Label>

  <DifficultySelector
    value={difficulty}
    onChange={setDifficulty}
  />

</div>
{/* Company */}

<div>

  <Label>

    Target Company

  </Label>

  <CompanySelector
    value={company}
    onChange={setCompany}
  />

</div>
{/* Time Per Question */}

<div>

  <Label>

    Time Per Question

  </Label>

  <Select
    value={timePerQuestion}
    onValueChange={setTimePerQuestion}
  >

    <SelectTrigger>

      <SelectValue />

    </SelectTrigger>

    <SelectContent>

      <SelectItem value="120">
        2 Minutes
      </SelectItem>

      <SelectItem value="300">
        5 Minutes
      </SelectItem>

      <SelectItem value="600">
        10 Minutes
      </SelectItem>

    </SelectContent>

  </Select>

</div>

            {/* Question Count */}

            <div>

              <Label>

                Number of Questions

              </Label>

              <Select
                value={questions}
                onValueChange={setQuestions}
              >

                <SelectTrigger>

                  <SelectValue />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="5">
                    5 Questions
                  </SelectItem>

                  <SelectItem value="10">
                    10 Questions
                  </SelectItem>

                  <SelectItem value="15">
                    15 Questions
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>
<div className="grid grid-cols-3 gap-4">

  <Button
    variant="outline"
    onClick={() => navigate("/interview/resume")}
  >
    Resume Interview
  </Button>

  <Button
    variant="outline"
    onClick={() => navigate("/interview/history")}
  >
    Interview History
  </Button>

  <Button
    variant="outline"
    onClick={() => navigate("/interview/voice")}
  >
    Voice Interview
  </Button>

</div>
            <Button
              onClick={handleStart}
              disabled={loading}
              className="w-full h-12 text-lg"
            >

              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating AI Interview...
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Start Interview
                </>
              )}

            </Button>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}