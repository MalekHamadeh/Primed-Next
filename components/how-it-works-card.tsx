import Image from "next/image";

type HowItWorksCardProps = React.HTMLAttributes<HTMLDivElement> & {
  imageSrc?: string;
};

export default function HowItWorksCard({
  imageSrc = "/images/how_it_works.jpg",
  ...props
}: HowItWorksCardProps) {
  const steps = [
    {
      title: "Online Questionnaire",
      description:
        "Answer some questions, ensure you are eligible, and receive the right treatment to help you achieve your goals.",
    },
    {
      title: "Telehealth",
      description:
        "Spend time discussing options available with our clinician. A suitable treatment plan will be available for you to order within 24 hours.",
    },
    {
      title: "Treatment Delivered",
      description:
        "Upon order, our partner compounding pharmacy will have your prescription filled and start preparing your treatment. Express delivered to your door once ready.",
    },
    {
      title: "Ongoing Premium Support",
      description:
        "We’re available to address any questions, with continued guidance to help you reach those goals, committed to helping you look and feel better.",
    },
  ];

  return (
    <div
      className="w-full"
      {...props}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left image (not background) */}
        <div className="flex items-start justify-center lg:justify-start">
          <div className="h-[520px] w-full max-w-[470px] rounded-[4px] overflow-hidden">
            <Image
              src={imageSrc}
              alt="How it works"
              width={470}
              height={520}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right process */}
        <div className="lg:pl-2">
          <div className="relative pl-6">
            {/* subtle vertical guide line */}
            <div className="absolute left-2 top-1 bottom-1 w-px bg-primary/30" />

            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative"
                >
                  <div className="flex items-start gap-3">
                    <span className="bg-primary text-white rounded-full px-2 py-1 text-[16px] leading-none font-normal">
                      {idx + 1}
                    </span>
                    <div className="mt-[-2px]">
                      <h4 className="text-[22px] font-normal text-primary-darker mb-1">
                        {step.title}
                      </h4>
                      <p className="max-w-[510px] text-[16px] font-normal text-muted-foreground m-0">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
