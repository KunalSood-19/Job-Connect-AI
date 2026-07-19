import { useEffect, useState } from "react";
import {
  scheduleInterview,
  updateInterview,
} from "@/api/interview";
interface Props {
  applicationId: string;
  onClose: () => void;
  onSuccess: () => void;

  interview?: any;
}

export default function ScheduleInterviewDialog({
  applicationId,
  onClose,
  onSuccess,
  interview,
}: Props) {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [mode, setMode] = useState("Google Meet");
  const [meetingLink, setMeetingLink] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
   useEffect(() => {
  if (!interview) return;

  const d = new Date(interview.interviewDate);

  setInterviewDate(d.toISOString().split("T")[0]);

  setInterviewTime(
    d.toTimeString().slice(0, 5)
  );

  setMode(interview.mode);

  setMeetingLink(interview.meetingLink || "");

  setLocation(interview.location || "");

  setNotes(interview.notes || "");

}, [interview]);
async function handleSchedule() {
  try {
   const isoDate = new Date(
  `${interviewDate}T${interviewTime}:00`
).toISOString();

if (interview) {

  await updateInterview(interview.id, {

    interviewDate: isoDate,

    mode,

    meetingLink,

    location,

    notes,

  });

  alert("Interview Updated Successfully");

} else {

  await scheduleInterview({

    applicationId,

    interviewDate: isoDate,

    mode,

    meetingLink,

    location,

    notes,

  });

  alert("Interview Scheduled Successfully");
}

    onClose();
    onSuccess();

  } catch (err) {
    console.error("Schedule Interview Error:", err);
    alert("Unable to schedule interview");
  }
 
}
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white text-black rounded-2x1 p-6 w-[500px] shadow-x1">

     <h2 className="text-2xl font-bold text-black mb-6">
  {interview ? "Edit Interview" : "Schedule Interview"}
</h2>

        <div className="space-y-4">

          <input
            type="date"
            className="w-full border rounded-lg p-3"
            value={interviewDate}
            onChange={(e) =>
              setInterviewDate(e.target.value)
            }
          />

          <input
            type="time"
            className="w-full border rounded-lg p-3"
            value={interviewTime}
            onChange={(e) =>
              setInterviewTime(e.target.value)
            }
          />

          <select
            className="w-full border rounded-lg p-3"
            value={mode}
            onChange={(e) =>
              setMode(e.target.value)
            }
          >
            <option>Google Meet</option>
            <option>Zoom</option>
            <option>Microsoft Teams</option>
            <option>Offline</option>
          </select>

          <input
            placeholder="Meeting Link"
            className="w-full border rounded-lg p-3"
            value={meetingLink}
            onChange={(e) =>
              setMeetingLink(e.target.value)
            }
          />

          <input
            placeholder="Location"
            className="w-full border rounded-lg p-3"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />

          <textarea
            rows={4}
            placeholder="Notes"
            className="w-full border rounded-lg p-3"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSchedule}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {interview ? "Update" : "Schedule"}
          </button>

        </div>

      </div>
    </div>
  );
}