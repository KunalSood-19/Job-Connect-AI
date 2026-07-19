import { useState } from "react";

import {
  Building2,
  User,
  Camera,
  BadgeCheck,
} from "lucide-react";
import { updateProfile, getProfile } from "@/api/profile";
import { useEffect } from "react";
import AvatarUpload from "@/components/profile/AvatarUpload";
import SkillInput from "@/components/profile/SkillInput";
import StatsCard from "@/components/profile/StatsCard";
import DocumentCard from "@/components/profile/DocumentCard";
import { uploadAvatar } from "@/api/profile";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

export default function RecruiterProfile() {
const [profile, setProfile] = useState({
  name: "",
  designation: "",
  department: "",
yearsOfExperience: "",
employeeId: "",
officeAddress: "",
hiringRegion: "",
  company: "",
  avatar: "",
  cover: "",
  companyLogo: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  

  companyName: "",
  companyIndustry: "",
  companyWebsite: "",
  companySize: "",
  companyFounded: "",
  companyAddress: "",
  companyDescription: "",

  culture: "",
  mission: "",
  vision: "",
  whyJoinUs: "",
  employeeBenefits: "",

  employmentTypes: "",
  experienceLevels: "",
  hiringLocations: "",

  linkedin: "",
  twitter: "",
  facebook: "",
  instagram: "",
  youtube: "",

  skills: [] as string[],
});
// Extract loadProfile so it can be called both on mount and after save
const loadProfile = async () => {
  try {
    const res = await getProfile();
    const r = res.user.recruiter as any;
    const c = r?.company;

    setProfile({
      name: res.user.name || "",
      email: res.user.email || "",
      phone: res.user.phone || "",
      location: res.user.location || "",
      bio: res.user.bio || "",
department: r?.department || "",
yearsOfExperience:
  r?.yearsOfExperience != null
    ? String(r.yearsOfExperience)
    : "",

employeeId: r?.employeeId || "",
officeAddress: r?.officeAddress || "",
hiringRegion: r?.hiringRegion || "",
      designation: r?.designation || "",
      company:     c?.name || "",

      // Company Info
      companyName:        c?.name || "",
      companyIndustry:    c?.industry || "",
      companyWebsite:     c?.website || "",
      companySize:        c?.employees != null ? String(c.employees) : "",
      companyFounded:     c?.foundedYear != null ? String(c.foundedYear) : "",
      companyAddress:     c?.location || "",
      companyDescription: c?.description || "",
      companyLogo:        c?.logo || "",

      avatar: res.user.avatar || "",
      cover: "",

      // Employer Branding
      culture:          r?.culture || "",
      mission:          r?.mission || "",
      vision:           r?.vision || "",
      whyJoinUs:        r?.whyJoinUs || "",
      employeeBenefits: r?.employeeBenefits || "",

      // Hiring Preferences (arrays stored as comma-joined strings in UI)
      employmentTypes:  (r?.employmentTypes ?? []).join(", "),
      experienceLevels: (r?.experienceLevels ?? []).join(", "),
      hiringLocations:  (r?.hiringLocations ?? []).join(", "),

      // Social Links (stored on company)
      linkedin:  c?.linkedinUrl || "",
      twitter:   c?.twitterUrl || "",
      facebook:  c?.facebookUrl || "",
      instagram: c?.instagramUrl || "",
      youtube:   c?.youtubeUrl || "",

      // Skills
      skills: r?.skills ?? [],
    });
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
};

useEffect(() => {
  loadProfile();
}, []);

const updateField = (key: string, value: any) => {
  setProfile((prev) => ({ ...prev, [key]: value }));
};

// Single save handler used by both Save buttons
const handleSave = async () => {
  try {
    // Convert comma-separated strings back to arrays for array fields
    const toArray = (s: string) =>
      s.split(",").map((v) => v.trim()).filter(Boolean);

    await updateProfile({
      name: profile.name,
      phone: profile.phone,
      bio: profile.bio,
      location: profile.location,

    recruiter: {
  designation: profile.designation,

  department: profile.department,

  yearsOfExperience:
    Number(profile.yearsOfExperience),

  employeeId: profile.employeeId,

  officeAddress: profile.officeAddress,

  hiringRegion: profile.hiringRegion,

  culture: profile.culture,
  mission: profile.mission,
  vision: profile.vision,
  whyJoinUs: profile.whyJoinUs,
  employeeBenefits: profile.employeeBenefits,

  employmentTypes: toArray(profile.employmentTypes),
  experienceLevels: toArray(profile.experienceLevels),
  hiringLocations: toArray(profile.hiringLocations),

  skills: profile.skills,
},

      company: {
        name:        profile.companyName,
        website:     profile.companyWebsite,
        location:    profile.companyAddress,
        industry:    profile.companyIndustry,
        description: profile.companyDescription,
        ...(profile.companySize    !== "" && { employees:   Number(profile.companySize) }),
        ...(profile.companyFounded !== "" && { foundedYear: Number(profile.companyFounded) }),
        logo:        profile.companyLogo,
        // Social links stored on company
        linkedinUrl:  profile.linkedin,
        twitterUrl:   profile.twitter,
        facebookUrl:  profile.facebook,
        instagramUrl: profile.instagram,
        youtubeUrl:   profile.youtube,
      },
    });

    // Re-fetch from server so the form reflects what was actually persisted
    await loadProfile();

    alert("Profile Updated Successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update profile");
  }
};

return(

<div className="container mx-auto py-8 space-y-8">

<Card className="overflow-hidden rounded-3xl">

<div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">

<Button

size="sm"

className="absolute top-4 right-4"

>

<Camera className="mr-2 h-4 w-4"/>

Upload Cover

</Button>

</div>

<CardContent>

<div className="-mt-20 flex flex-col md:flex-row gap-8 items-center">

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

<div className="flex-1">

<div className="flex items-center gap-2">

<h1 className="text-3xl font-bold">

{profile.name}

</h1>

<BadgeCheck className="text-blue-500"/>

</div>

<p className="text-lg text-muted-foreground">

{profile.designation}

</p>

<div className="mt-4 flex items-center gap-4">

<div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">

<Building2 className="h-8 w-8"/>

</div>

<div>

<h2 className="font-semibold text-xl">

{profile.company}

</h2>

<p className="text-muted-foreground">

Verified Company

</p>

</div>

</div>

</div>

<Button onClick={handleSave}>

Save Changes

</Button>

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
              onChange={(e)=>
                updateField("name",e.target.value)
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
              Phone Number
            </label>

            <Input
              value={profile.phone}
              onChange={(e)=>
                updateField("phone",e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Location
            </label>

            <Input
              value={profile.location}
              onChange={(e)=>
                updateField("location",e.target.value)
              }
            />

          </div>

          <div className="md:col-span-2">

            <label className="text-sm font-medium">
              About Me
            </label>

            <Textarea
              rows={5}
              placeholder="Tell candidates about yourself..."
              value={profile.bio}
              onChange={(e)=>
                updateField("bio",e.target.value)
              }
            />

          </div>

        </CardContent>

      </Card>

      {/* Professional Information */}

      <Card>

        <CardHeader>

          <CardTitle>

            Professional Information

          </CardTitle>

        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="text-sm font-medium">
              Designation
            </label>

            <Input
              value={profile.designation}
              onChange={(e)=>
                updateField("designation",e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Department
            </label>

            <Input
  value={profile.department}
  onChange={(e) =>
    updateField("department", e.target.value)
  }
/>

          </div>

          <div>

            <label className="text-sm font-medium">
              Years of Experience
            </label>

        <Input
  value={profile.yearsOfExperience}
  onChange={(e) =>
    updateField("yearsOfExperience", e.target.value)
  }
/>

          </div>

          <div>

            <label className="text-sm font-medium">
              Employee ID
            </label>

          <Input
  value={profile.employeeId}
  onChange={(e) =>
    updateField("employeeId", e.target.value)
  }
/>

          </div>

          <div>

            <label className="text-sm font-medium">
              Office Address
            </label>

         <Input
  value={profile.officeAddress}
  onChange={(e) =>
    updateField("officeAddress", e.target.value)
  }
/>

          </div>

          <div>

            <label className="text-sm font-medium">
              Hiring Region
            </label>

           <Input
  value={profile.hiringRegion}
  onChange={(e) =>
    updateField("hiringRegion", e.target.value)
  }
/>

          </div>

        </CardContent>

      </Card>
      {/* Company Information */}

<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Building2 className="h-5 w-5" />
      Company Information
    </CardTitle>
  </CardHeader>

  <CardContent className="grid md:grid-cols-2 gap-5">

    <div>
      <label className="text-sm font-medium">Company Name</label>
      <Input
        value={profile.companyName || ""}
        onChange={(e) =>
          updateField("companyName", e.target.value)
        }
      />
    </div>

    <div>
      <label className="text-sm font-medium">Industry</label>
      <Input
        value={profile.companyIndustry || ""}
        onChange={(e) =>
          updateField("companyIndustry", e.target.value)
        }
      />
    </div>

    <div>
      <label className="text-sm font-medium">Website</label>
      <Input
        value={profile.companyWebsite || ""}
        onChange={(e) =>
          updateField("companyWebsite", e.target.value)
        }
      />
    </div>

    <div>
      <label className="text-sm font-medium">Company Size</label>
      <Input
        value={profile.companySize || ""}
        onChange={(e) =>
          updateField("companySize", e.target.value)
        }
      />
    </div>

    <div>
      <label className="text-sm font-medium">Founded Year</label>
      <Input
        value={profile.companyFounded || ""}
        onChange={(e) =>
          updateField("companyFounded", e.target.value)
        }
      />
    </div>

    <div>
      <label className="text-sm font-medium">Company Address</label>
      <Input
        value={profile.companyAddress || ""}
        onChange={(e) =>
          updateField("companyAddress", e.target.value)
        }
      />
    </div>

    <div className="md:col-span-2">
      <label className="text-sm font-medium">
        Company Description
      </label>

      <Textarea
        rows={5}
        value={profile.companyDescription || ""}
        onChange={(e) =>
          updateField("companyDescription", e.target.value)
        }
      />
    </div>

  </CardContent>
</Card>

{/* Employer Branding */}

<Card>

  <CardHeader>

    <CardTitle>

      Employer Branding

    </CardTitle>

  </CardHeader>

  <CardContent className="space-y-6">

    <div>

      <label className="text-sm font-medium">
        Company Culture
      </label>

      <Textarea
        rows={4}
        value={profile.culture || ""}
        onChange={(e)=>
          updateField("culture",e.target.value)
        }
      />

    </div>

    <div>

      <label className="text-sm font-medium">
        Mission
      </label>

      <Textarea
        rows={3}
        value={profile.mission || ""}
        onChange={(e)=>
          updateField("mission",e.target.value)
        }
      />

    </div>

    <div>

      <label className="text-sm font-medium">
        Vision
      </label>

      <Textarea
        rows={3}
        value={profile.vision || ""}
        onChange={(e)=>
          updateField("vision",e.target.value)
        }
      />

    </div>

    <div>

      <label className="text-sm font-medium">
        Why Join Us
      </label>

      <Textarea
        rows={4}
        value={profile.whyJoinUs || ""}
        onChange={(e)=>
          updateField("whyJoinUs",e.target.value)
        }
      />

    </div>

    <div>

      <label className="text-sm font-medium">
        Employee Benefits
      </label>

      <Textarea
        rows={4}
        value={profile.employeeBenefits || ""}
        onChange={(e)=>
          updateField("employeeBenefits",e.target.value)
        }
      />

    </div>

  </CardContent>

</Card>
{/* Hiring Preferences */}

<Card>

  <CardHeader>

    <CardTitle>

      Hiring Preferences

    </CardTitle>

  </CardHeader>

  <CardContent className="grid md:grid-cols-2 gap-5">

    <div>

      <label className="text-sm font-medium">
        Employment Types
      </label>

      <Input
        placeholder="Full Time, Internship, Remote..."
        value={profile.employmentTypes || ""}
        onChange={(e)=>
          updateField("employmentTypes",e.target.value)
        }
      />

    </div>

    <div>

      <label className="text-sm font-medium">
        Experience Levels
      </label>

      <Input
        placeholder="Fresher, Junior, Senior..."
        value={profile.experienceLevels || ""}
        onChange={(e)=>
          updateField("experienceLevels",e.target.value)
        }
      />

    </div>

    <div className="md:col-span-2">

      <label className="text-sm font-medium">
        Hiring Locations
      </label>

      <Input
        placeholder="Bangalore, Delhi, Pune..."
        value={profile.hiringLocations || ""}
        onChange={(e)=>
          updateField("hiringLocations",e.target.value)
        }
      />

    </div>

  </CardContent>

</Card>

{/* Preferred Skills */}

<Card>

  <CardHeader>

    <CardTitle>

      Preferred Skills

    </CardTitle>

  </CardHeader>

  <CardContent>

    <SkillInput
      value={profile.skills || []}
      onChange={(skills)=>
        updateField("skills",skills)
      }
    />

  </CardContent>

</Card>

{/* Company Social Links */}

<Card>

  <CardHeader>

    <CardTitle>

      Company Social Links

    </CardTitle>

  </CardHeader>

  <CardContent className="grid md:grid-cols-2 gap-5">

    <div>

      <label className="text-sm font-medium">
        Website
      </label>

      <Input
        value={profile.companyWebsite || ""}
        onChange={(e)=>
          updateField("companyWebsite",e.target.value)
        }
      />

    </div>

    <div>

      <label className="text-sm font-medium">
        LinkedIn
      </label>

      <Input
        value={profile.linkedin || ""}
        onChange={(e)=>
          updateField("linkedin",e.target.value)
        }
      />

    </div>

    <div>

      <label className="text-sm font-medium">
        Twitter / X
      </label>

      <Input
        value={profile.twitter || ""}
        onChange={(e)=>
          updateField("twitter",e.target.value)
        }
      />

    </div>

    <div>

      <label className="text-sm font-medium">
        Facebook
      </label>

      <Input
        value={profile.facebook || ""}
        onChange={(e)=>
          updateField("facebook",e.target.value)
        }
      />

    </div>

    <div>

      <label className="text-sm font-medium">
        Instagram
      </label>

      <Input
        value={profile.instagram || ""}
        onChange={(e)=>
          updateField("instagram",e.target.value)
        }
      />

    </div>

    <div>

      <label className="text-sm font-medium">
        YouTube
      </label>

      <Input
        value={profile.youtube || ""}
        onChange={(e)=>
          updateField("youtube",e.target.value)
        }
      />

    </div>

  </CardContent>

</Card>
{/* Dashboard Statistics */}

<Card>

  <CardHeader>

    <CardTitle>

      Dashboard Overview

    </CardTitle>

  </CardHeader>

  <CardContent>

    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

      <StatsCard
        title="Jobs Posted"
        value={24}
        icon={Building2}
      />

      <StatsCard
        title="Applications"
        value={186}
        icon={User}
      />

      <StatsCard
        title="Interviews"
        value={38}
        icon={User}
      />

      <StatsCard
        title="Offers"
        value={12}
        icon={BadgeCheck}
      />

    </div>

  </CardContent>

</Card>

{/* Recent Jobs */}

<Card>

  <CardHeader>

    <CardTitle>

      Recent Jobs

    </CardTitle>

  </CardHeader>

  <CardContent>

    <div className="space-y-4">

      {[1,2,3].map((job)=>(
        <Card key={job}>

          <CardContent className="flex items-center justify-between p-5">

            <div>

              <h3 className="font-semibold">

                Senior React Developer

              </h3>

              <p className="text-sm text-muted-foreground">

                Bangalore • Full Time

              </p>

            </div>

            <div className="flex gap-2">

              <Button
                variant="outline"
                size="sm"
              >
                Edit
              </Button>

              <Button
                variant="secondary"
                size="sm"
              >
                Applicants
              </Button>

            </div>

          </CardContent>

        </Card>
      ))}

    </div>

  </CardContent>

</Card>

{/* Recent Applicants */}

<Card>

  <CardHeader>

    <CardTitle>

      Recent Applicants

    </CardTitle>

  </CardHeader>

  <CardContent>

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-3">
              Candidate
            </th>

            <th className="text-left py-3">
              Job
            </th>

            <th className="text-left py-3">
              Status
            </th>

            <th className="text-left py-3">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {[1,2,3].map((item)=>(

            <tr
              key={item}
              className="border-b"
            >

              <td className="py-4">

                John Doe

              </td>

              <td>

                Frontend Developer

              </td>

              <td>

                <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs">

                  Shortlisted

                </span>

              </td>

              <td>

                <Button
                  size="sm"
                >
                  View Resume
                </Button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </CardContent>

</Card>
{/* Documents */}

<Card>

  <CardHeader>

    <CardTitle>

      Company Documents

    </CardTitle>

  </CardHeader>

  <CardContent>

    <div className="grid md:grid-cols-2 gap-5">

      <DocumentCard
        title="GST Certificate"
        fileName="gst.pdf"
        fileUrl="#"
      />

      <DocumentCard
        title="PAN Card"
        fileName="pan.pdf"
        fileUrl="#"
      />

      <DocumentCard
        title="Company Registration"
        fileName="registration.pdf"
        fileUrl="#"
      />

      <DocumentCard
        title="Company Brochure"
        fileName="brochure.pdf"
        fileUrl="#"
      />

    </div>

  </CardContent>

</Card>

{/* Notification Settings */}

<Card>

  <CardHeader>

    <CardTitle>

      Notification Settings

    </CardTitle>

  </CardHeader>

  <CardContent className="space-y-5">

    <label className="flex items-center justify-between">

      <span>Email Notifications</span>

      <input
        type="checkbox"
        defaultChecked
      />

    </label>

    <label className="flex items-center justify-between">

      <span>Push Notifications</span>

      <input
        type="checkbox"
        defaultChecked
      />

    </label>

    <label className="flex items-center justify-between">

      <span>Interview Alerts</span>

      <input
        type="checkbox"
        defaultChecked
      />

    </label>

    <label className="flex items-center justify-between">

      <span>Candidate Alerts</span>

      <input
        type="checkbox"
        defaultChecked
      />

    </label>

  </CardContent>

</Card>

{/* Security */}

<Card>

  <CardHeader>

    <CardTitle>

      Security

    </CardTitle>

  </CardHeader>

  <CardContent className="flex flex-wrap gap-4">

    <Button variant="outline">

      Change Password

    </Button>

    <Button variant="outline">

      Logout All Devices

    </Button>

    <Button variant="destructive">

      Delete Account

    </Button>

  </CardContent>

</Card>

{/* Save */}

<div className="flex justify-end">

  <Button
    size="lg"
   onClick={handleSave}
  >

    Save Changes

  </Button>

</div>

</div>

);

}