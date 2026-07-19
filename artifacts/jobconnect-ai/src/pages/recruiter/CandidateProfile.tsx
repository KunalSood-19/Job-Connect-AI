import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import {
  saveRecruiterNote,
  getRecruiterNote,
} from "@/api/recruiter";
import { getCandidateProfile } from "@/api/profile";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  FileText,
  Download,
} from "lucide-react";
export default function CandidateProfile() {
  const [, params] = useRoute("/recruiter/candidate/:userId");

  const [candidate, setCandidate] = useState<any>(null);
const [note, setNote] = useState("");
  useEffect(() => {
    if (params?.userId) {
      loadCandidate();
    }
  }, [params]);

async function loadCandidate() {
  try {
    const res = await getCandidateProfile(params!.userId);
    setCandidate(res.candidate);

    const noteRes = await getRecruiterNote(params!.userId);

    if (noteRes.note) {
      setNote(noteRes.note.note);
    }

  } catch (err) {
    console.error(err);
  }
}

  if (!candidate) {
    return (
      <div className="container mx-auto py-10">
        Loading...
      </div>
    );
  }
async function handleSaveNote() {
  try {
    await saveRecruiterNote(
      params!.userId,
      note
    );

    alert("Notes saved successfully!");

  } catch (err) {
    console.error(err);
    alert("Unable to save notes");
  }
}
  return (
   <div className="container mx-auto max-w-6xl py-8">

  {/* Header */}
  <div className="rounded-2xl border bg-card p-8 shadow-sm">

    <div className="flex flex-col md:flex-row items-center gap-8">

      <img
        src={
          candidate.avatar ||
          `https://ui-avatars.com/api/?name=${candidate.name}`
        }
        className="w-32 h-32 rounded-full object-cover border-4 border-primary"
      />

      <div className="flex-1">

        <h1 className="text-4xl font-bold">
          {candidate.name}
        </h1>

        <p className="text-lg text-muted-foreground mt-1">
          {candidate.student?.degree || "Student"}
        </p>

        <div className="grid md:grid-cols-2 gap-3 mt-6">

          <div className="flex items-center gap-2">
            <Mail size={18} />
            {candidate.email}
          </div>

          <div className="flex items-center gap-2">
            <Phone size={18} />
            {candidate.phone || "Not Available"}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={18} />
            {candidate.location || "Not Available"}
          </div>

        </div>

      </div>

    </div>

  </div>

  {/* About */}

  <div className="rounded-2xl border bg-card p-6 mt-6 shadow-sm">

    <h2 className="text-2xl font-semibold mb-4">
      About
    </h2>

    <p className="text-muted-foreground leading-7">
      {candidate.bio || "No bio added."}
    </p>

  </div>

  {/* Education */}

  <div className="rounded-2xl border bg-card p-6 mt-6 shadow-sm">

    <h2 className="text-2xl font-semibold flex items-center gap-2">

      <GraduationCap />

      Education

    </h2>

    <div className="grid md:grid-cols-2 gap-4 mt-6">

      <div>

        <p className="text-sm text-muted-foreground">
          College
        </p>

        <p className="font-semibold">
          {candidate.student?.college}
        </p>

      </div>

      <div>

        <p className="text-sm text-muted-foreground">
          Degree
        </p>

        <p className="font-semibold">
          {candidate.student?.degree}
        </p>

      </div>

      <div>

        <p className="text-sm text-muted-foreground">
          Branch
        </p>

        <p className="font-semibold">
          {candidate.student?.branch}
        </p>

      </div>

      <div>

        <p className="text-sm text-muted-foreground">
          CGPA
        </p>

        <p className="font-semibold">
          {candidate.student?.cgpa}
        </p>

      </div>

    </div>

  </div>

  {/* Skills */}

  <div className="rounded-2xl border bg-card p-6 mt-6 shadow-sm">

    <h2 className="text-2xl font-semibold mb-5">
      Skills
    </h2>

    <div className="flex flex-wrap gap-3">

      {candidate.student?.skills?.length ? (

        candidate.student.skills.map((skill: string) => (

          <span
            key={skill}
            className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium"
          >
            {skill}
          </span>

        ))

      ) : (

        <p>No Skills Added</p>

      )}

    </div>

  </div>

  {/* Links */}

  <div className="rounded-2xl border bg-card p-6 mt-6 shadow-sm">

    <h2 className="text-2xl font-semibold mb-5">
      Professional Links
    </h2>

    <div className="space-y-4">

      {candidate.student?.github && (

        <a
          href={candidate.student.github}
          target="_blank"
          className="flex items-center gap-3 hover:text-blue-500"
        >
          <Github size={20} />
          GitHub
        </a>

      )}

      {candidate.student?.linkedin && (

        <a
          href={candidate.student.linkedin}
          target="_blank"
          className="flex items-center gap-3 hover:text-blue-500"
        >
          <Linkedin size={20} />
          LinkedIn
        </a>

      )}

      {candidate.student?.portfolio && (

        <a
          href={candidate.student.portfolio}
          target="_blank"
          className="flex items-center gap-3 hover:text-blue-500"
        >
          <Globe size={20} />
          Portfolio
        </a>

      )}

    </div>

  </div>

  {/* Resume */}

  <div className="rounded-2xl border bg-card p-6 mt-6 shadow-sm">

    <h2 className="text-2xl font-semibold flex items-center gap-2 mb-5">

      <FileText />

      Resume

    </h2>

    {candidate.resumes.length > 0 ? (

      <div>

        <div className="flex gap-4 mb-6">

          <button
            onClick={() =>
              window.open(candidate.resumes[0].fileUrl, "_blank")
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >
            👁 Preview Resume
          </button>

          <a
            href={candidate.resumes[0].fileUrl}
            download
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Download size={18} />
            Download Resume
          </a>

        </div>

        <iframe
          src={candidate.resumes[0].fileUrl}
          className="w-full h-[700px] rounded-xl border"
        />

      </div>

    ) : (

      <p className="text-muted-foreground">
        No Resume Uploaded
      </p>

    )}

  </div>
<div className="rounded-2xl border bg-card p-6 mt-6 shadow-sm">

  <h2 className="text-2xl font-semibold mb-4">
    Recruiter Notes
  </h2>

<textarea
  rows={6}
  value={note}
  onChange={(e) => setNote(e.target.value)}
  placeholder="Write recruiter notes..."
  className="w-full rounded-xl border p-4 bg-background"
/>

 <button
  onClick={handleSaveNote}
  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl"
>
  Save Notes
</button>
</div>
</div>


  );
  
}