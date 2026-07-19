import { useResume } from "@/context/ResumeContext";

const templates = [
  {
    id: "ATS",
    name: "ATS Professional",
    description: "Best for job applications",
  },
  {
    id: "Modern",
    name: "Modern",
    description: "Clean & stylish",
  },
  {
    id: "Minimal",
    name: "Minimal",
    description: "Simple & elegant",
  },
  {
    id: "Corporate",
    name: "Corporate",
    description: "Professional layout",
  },
];

export default function TemplateSelector() {
  const { template, setTemplate } = useResume();

  return (
    <div className="rounded-xl border p-5 bg-white dark:bg-slate-900">
      <h2 className="text-xl font-bold mb-4">
        Choose Resume Template
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {templates.map((item) => (
          <button
            key={item.id}
            onClick={() => setTemplate(item.id)}
            className={`rounded-xl border p-4 text-left transition-all ${
              template === item.id
                ? "border-violet-600 bg-violet-600 text-white"
                : "hover:border-violet-500"
            }`}
          >
            <h3 className="font-semibold">{item.name}</h3>

            <p className="text-sm opacity-80 mt-1">
              {item.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}