import Link from "next/link";
import Image from "next/image";
type DescriptionCardProps = React.HTMLAttributes<HTMLDivElement> & {
  leftImageSrc?: string;
  processLineSrc?: string;
};

export default function DescriptionCard({
  leftImageSrc = "/images/start_your_journey.jpg",
  processLineSrc = "/images/workProcess3.png",
  ...props
}: DescriptionCardProps) {
  return (
    <div
      className="w-full"
      {...props}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left image (not background) */}
        <div className="flex items-start justify-center lg:justify-start">
          <div className="w-full max-w-[470px] h-[520px] rounded-[4px] overflow-hidden">
            <Image
              src={leftImageSrc}
              alt="Start your journey"
              width={470}
              height={520}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right content */}
        <div className="lg:pl-2">
          <h4 className="text-[18px] md:text-[20px] font-semibold text-primary-darker mb-4">
            Book a FREE initial consultation with one of our dedicated
            practitioners.
          </h4>

          <div className="relative pl-6">
            {/* process line image */}
            <div className="absolute left-0 top-0 bottom-0 flex items-center">
              <Image
                src={processLineSrc}
                alt="process"
                width={12}
                height={520}
                className="h-full w-auto"
              />
            </div>
            <div className="space-y-6">
              <p className="max-w-[510px] text-[16px] font-normal text-muted-foreground">
                Fill out the online medical form, tell us about your goals, and
                we connect you with our qualified clinicians to provide suitable
                personalised therapies, allowing private and convenient access.
              </p>
              <p className="max-w-[510px] text-[16px] font-normal text-muted-foreground">
                Free consultation. No upfront fees. Only pay for your program.
              </p>
              <p className="max-w-[510px] text-[16px] font-normal text-muted-foreground">
                100% commitment free, handling all admin, and guiding you with
                premium support every step of the way.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/our-treatments"
              scroll
            >
              <button className="bg-primary-dark text-white rounded-[4px] px-3 py-2 w-full max-w-[170px] hover:opacity-80">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
