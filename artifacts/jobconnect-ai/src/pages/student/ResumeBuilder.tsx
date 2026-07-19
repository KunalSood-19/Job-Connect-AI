import { ResumeProvider } from "@/context/ResumeContext";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import TemplateSelector from "@/components/resume/TemplateSelector";

export default function ResumeBuilder() {
  return (
    <ResumeProvider>
      <div className="grid lg:grid-cols-2 gap-6 p-6">
        <div className="space-y-6">
          <TemplateSelector />
          <ResumeForm />
        </div>

        <ResumePreview />
      </div>
    </ResumeProvider>
  );
}