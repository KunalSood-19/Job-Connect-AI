import { useState } from "react";
import {
  User,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  Save,
} from "lucide-react";
import { useEffect } from "react";
import { getProfile } from "@/api/profile";
import { updateProfile } from "@/api/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { uploadAvatar } from "@/api/profile";
import { uploadResume } from "@/api/profile";
import AvatarUpload from "@/components/profile/AvatarUpload";
import SkillInput from "@/components/profile/SkillInput";
import ResumeCard from "@/components/profile/ResumeCard";

export default function StudentProfile() {
 const [profile, setProfile] = useState<any>(null);
useEffect(() => {
  async function loadProfile() {
    const res = await getProfile();

    setProfile({
  name: res.user.name,
  email: res.user.email,
  phone: res.user.phone || "",
  bio: res.user.bio || "",
  location: res.user.location || "",

  college: res.user.student?.college || "",
  degree: res.user.student?.degree || "",
  branch: res.user.student?.branch || "",
  cgpa: res.user.student?.cgpa || "",
  graduation: res.user.student?.graduation || "",

  github: res.user.student?.github || "",
  linkedin: res.user.student?.linkedin || "",
  portfolio: res.user.student?.portfolio || "",

  avatar: res.user.avatar || "",

  skills: res.user.student?.skills || [],

  // ✅ ADD THIS
  resumes: res.user.resumes || [],
});
  }

  loadProfile();
}, []);
if (!profile) {
  return (
    <div className="flex items-center justify-center h-screen">
      Loading...
    </div>
  );
}
  const updateField = (
    key: string,
    value: any
  ) => {
    setProfile((prev:any) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">

      {/* Hero */}

      <Card className="rounded-3xl overflow-hidden">

        <div className="h-52 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

        <CardContent>

          <div className="-mt-20 flex flex-col items-center">

          <AvatarUpload
  image={profile.avatar}
  name={profile.name}
  onUpload={async (file) => {
    try {
      const res = await uploadAvatar(file);

      setProfile((prev: any) => ({
        ...prev,
        avatar: res.url,
      }));

      alert("Avatar uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  }}
/>

            <h1 className="mt-5 text-3xl font-bold">
              {profile.name}
            </h1>

            <p className="text-muted-foreground">
              {profile.Degree}
            </p>

          </div>

        </CardContent>

      </Card>

      {/* Personal Information */}

      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <User className="h-5 w-5" />

            Personal Information

          </CardTitle>

        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="text-sm font-medium">
              Full Name
            </label>

            <Input
              value={profile.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Email
            </label>

            <Input
              disabled
              value={profile.email}
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Phone
            </label>

            <Input
              value={profile.phone}
              onChange={(e) =>
                updateField("phone", e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Location
            </label>

            <Input
              value={profile.location}
              onChange={(e) =>
                updateField("location", e.target.value)
              }
            />

          </div>

          <div className="md:col-span-2">

            <label className="text-sm font-medium">
              About Me
            </label>

            <Textarea
              rows={5}
              placeholder="Tell recruiters about yourself..."
              value={profile.bio}
              onChange={(e) =>
                updateField("bio", e.target.value)
              }
            />

          </div>

        </CardContent>

      </Card>
            {/* Education */}

      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <GraduationCap className="h-5 w-5" />

            Education

          </CardTitle>

        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="text-sm font-medium">
              College
            </label>

            <Input
              placeholder="Enter College Name"
              value={profile.college}
              onChange={(e) =>
                updateField("college", e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Degree
            </label>

            <Input
              placeholder="Enter Degree"
              value={profile.degree}
              onChange={(e) =>
                updateField("degree", e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Branch
            </label>

            <Input
              placeholder="Enter Degree"
              value={profile.branch}
              onChange={(e) =>
                updateField("branch", e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              CGPA
            </label>

            <Input
              placeholder="Enter CGPA"
              value={profile.cgpa}
              onChange={(e) =>
                updateField("cgpa", e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Graduation Year
            </label>

            <Input
              placeholder="Enter year of completion"
              value={profile.graduation}
              onChange={(e) =>
                updateField("graduation", e.target.value)
              }
            />

          </div>

        </CardContent>

      </Card>

      {/* Skills */}

      <Card>

        <CardHeader>

          <CardTitle>

            Skills

          </CardTitle>

        </CardHeader>

        <CardContent>

          <SkillInput
            value={profile.skills}
            onChange={(skills) =>
              updateField("skills", skills)
            }
          />

        </CardContent>

      </Card>

      {/* Resume */}

      <ResumeCard
  fileName={profile.resumes?.[0]?.title || ""}
  fileUrl={profile.resumes?.[0]?.fileUrl || ""}

  onUpload={async (file) => {
    try {
      const res = await uploadResume(file);

      setProfile((prev: any) => ({
        ...prev,
        resumes: [res.resume],
      }));

      alert("Resume uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Resume upload failed");
    }
  }}

  onDelete={async () => {}}
/>

      {/* Social Links */}

      <Card>

        <CardHeader>

          <CardTitle>

            Social Links

          </CardTitle>

        </CardHeader>

        <CardContent className="space-y-5">

          <div>

            <label className="flex items-center gap-2 text-sm font-medium mb-2">

              <Github className="h-4 w-4" />

              GitHub

            </label>

            <Input
              placeholder="https://github.com/username"
              value={profile.github}
              onChange={(e) =>
                updateField("github", e.target.value)
              }
            />

          </div>

          <div>

            <label className="flex items-center gap-2 text-sm font-medium mb-2">

              <Linkedin className="h-4 w-4" />

              LinkedIn

            </label>

            <Input
              placeholder="https://linkedin.com/in/username"
              value={profile.linkedin}
              onChange={(e) =>
                updateField("linkedin", e.target.value)
              }
            />

          </div>

          <div>

            <label className="flex items-center gap-2 text-sm font-medium mb-2">

              <Globe className="h-4 w-4" />

              Portfolio

            </label>

            <Input
              placeholder="https://portfolio.com"
              value={profile.portfolio}
              onChange={(e) =>
                updateField("portfolio", e.target.value)
              }
            />

          </div>

        </CardContent>

      </Card>
      <Separator />

      <div className="flex justify-end">

        <Button
          size="lg"
          className="px-8"
        onClick={async () => {
  try {
    console.log("Sending:", {
      name: profile.name,
      phone: profile.phone,
      bio: profile.bio,
      location: profile.location,
      student: {
        college: profile.college,
        degree: profile.degree,
        branch: profile.branch,
        cgpa: Number(profile.cgpa),
        graduation: Number(profile.graduation),
        github: profile.github,
        linkedin: profile.linkedin,
        portfolio: profile.portfolio,
        skills: profile.skills,
      },
    });

    const res = await updateProfile({
      name: profile.name,
      phone: profile.phone,
      bio: profile.bio,
      location: profile.location,
      student: {
        college: profile.college,
        degree: profile.degree,
        branch: profile.branch,
        cgpa: Number(profile.cgpa),
        graduation: Number(profile.graduation),
        github: profile.github,
        linkedin: profile.linkedin,
        portfolio: profile.portfolio,
        skills: profile.skills,
      },
    });

    console.log("Response:", res);

    alert("Profile Updated Successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update profile");
  }
}}
          >

            <Save className="mr-2 h-4 w-4" />

            Save Changes

          </Button>

        </div>

      </div>
    );
}