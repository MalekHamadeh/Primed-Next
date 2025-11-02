import Link from "next/link";
import Image from "next/image";

type BenefitsCardProps = React.HTMLAttributes<HTMLDivElement> & {
  imageSrc?: string;
};

export default function BenefitsCard({
  imageSrc = "/images/doctors_image.jpg",
  ...props
}: BenefitsCardProps) {
  const lines = [
    <span key="fee">
      Consultation Fee ={" "}
      <span className="text-primary font-bold text-[22px]">$0</span>
    </span>,
    "✅ Comprehensive medical review and personalised treatment",
    "✅ Access to your own online portal - appointments, online ordering, prescriptions",
    "✅ No waiting rooms. No hidden fees. No referral required",
    "✅ Only pay for your treatment",
    "✅ More affordable compared to other clinics and providers",
    "✅ Australia-wide free express delivery",
    "✅ FREE Premium support and ongoing transparent and compassionate care",
  ];

  return (
    <div
      className="w-full"
      {...props}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left image panel */}
        <div className="flex items-start justify-center lg:justify-start">
          <div className="h-[520px] w-full max-w-[470px] rounded-[4px] overflow-hidden mb-8 lg:mb-0">
            <Image
              src={imageSrc}
              alt="Benefits"
              width={470}
              height={520}
              className="w-full h-full object-cover"
              priority={false}
            />
          </div>
        </div>

        {/* Right details card */}
        <div className="flex flex-col">
          <div className="self-start w-fit rounded-xl bg-secondary shadow-sm p-6 md:p-8">
            <div className="flex flex-col gap-3">
              {lines.map((content, idx) => (
                <p
                  key={idx}
                  className="m-0 text-[15px] leading-snug font-medium text-primary-darker flex items-center gap-2"
                >
                  {typeof content === "string" ? content : content}
                </p>
              ))}
            </div>
            <div className="w-full text-left mt-10">
              <Link
                href="/our-treatments"
                scroll
              >
                <button className="mt-3 bg-primary-dark text-white rounded-[4px] px-3 py-2 w-full max-w-[170px] hover:opacity-80">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
