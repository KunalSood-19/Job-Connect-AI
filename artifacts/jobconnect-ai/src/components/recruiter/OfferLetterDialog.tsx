import { useState } from "react";
import { createOfferLetter } from "@/api/offerLetter";

interface Props {
  applicationId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OfferLetterDialog({
  applicationId,
  onClose,
  onSuccess,
}: Props) {
  const [designation, setDesignation] = useState("");
  const [salary, setSalary] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("Hybrid");
  const [hrName, setHrName] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      await createOfferLetter({
        applicationId,
        designation,
        salary: Number(salary),
        joiningDate,
        location,
        workMode,
        hrName,
        notes,
      });

      alert("Offer Letter Generated Successfully");

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Unable to generate offer letter");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl text-black">

        <h2 className="text-2xl font-bold mb-6">
          Generate Offer Letter
        </h2>

        <div className="space-y-4">

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />

          <input
            type="number"
            className="w-full border rounded-lg p-3"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <input
            type="date"
            className="w-full border rounded-lg p-3"
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            className="w-full border rounded-lg p-3"
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
          >
            <option>Hybrid</option>
            <option>Remote</option>
            <option>Onsite</option>
          </select>

          <input
            className="w-full border rounded-lg p-3"
            placeholder="HR Name"
            value={hrName}
            onChange={(e) => setHrName(e.target.value)}
          />

          <textarea
            className="w-full border rounded-lg p-3"
            rows={4}
            placeholder="Additional Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            {loading ? "Generating..." : "Generate Offer"}
          </button>

        </div>

      </div>
    </div>
  );
}