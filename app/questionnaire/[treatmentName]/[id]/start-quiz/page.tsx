import type { Metadata } from "next";
import SurveyQuestions from "./SurveyQuestions";

export const metadata: Metadata = {
  title: "Start Questionnaire | Primed Clinic",
};

export default async function Page({
  params,
}: {
  params: Promise<{ treatmentName: string; id: string }>;
}) {
  const { treatmentName, id } = await params;
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center p-6">
      <SurveyQuestions
        treatmentName={treatmentName}
        id={id}
      />
    </div>
  );
}
