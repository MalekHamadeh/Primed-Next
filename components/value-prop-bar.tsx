import {
  FaPills,
  FaHeartbeat,
  FaFlask,
  FaUserMd,
  FaHeadset,
  FaLaptopMedical,
  FaTruck,
  FaCircle,
} from "react-icons/fa";

function Item({ children }: { children: React.ReactNode }) {
  return <span className="flex items-center gap-2 px-2">{children}</span>;
}

function Dot() {
  return (
    <span className="inline-flex items-center justify-center mx-4">
      <FaCircle size={7} />
    </span>
  );
}

function Track({ className }: { className?: string }) {
  return (
    <div className={`flex items-center whitespace-nowrap ${className ?? ""}`}>
      <Item>
        <FaPills className="text-lg" /> Peptide Programs
      </Item>
      <Dot />
      <Item>
        <FaHeartbeat className="text-lg" /> Hormone Therapy
      </Item>
      <Dot />
      <Item>
        <FaFlask className="text-lg" /> Compounded Treatments For Your Care
      </Item>
      <Dot />
      <Item>
        <FaLaptopMedical className="text-lg" /> 100% Telehealth
      </Item>
      <Dot />
      <Item>
        <FaUserMd className="text-lg" /> FREE Consultation
      </Item>
      <Dot />
      <Item>
        <FaHeadset className="text-lg" /> FREE Ongoing Premium Support
      </Item>
      <Dot />
      <Item>
        <FaTruck className="text-lg" /> FREE Express Delivery Australia-Wide
      </Item>
      {/* no trailing dot to avoid seam bump */}
    </div>
  );
}

export default function ValuePropBar() {
  return (
    <div className="bg-primary text-primary-foreground text-[15px] font-semibold py-[14px] overflow-hidden relative w-full">
      <div className="flex animate-marquee will-change-transform whitespace-nowrap">
        <Track className="flex-none" />
      </div>
    </div>
  );
}
