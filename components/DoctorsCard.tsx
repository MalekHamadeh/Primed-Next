import Image from "next/image";

export type DoctorsCardProps = {
  imageSrc: string;
  doctorName: string;
  doctorRole: string;
};

export default function DoctorsCard({
  imageSrc,
  doctorName,
  doctorRole,
}: DoctorsCardProps) {
  return (
    <div className="max-w-[330px] mb-[30px] relative border border-[rgba(217,217,217,0.42)] rounded-t-[8px] overflow-hidden cursor-pointer bg-white mx-auto">
      <div className="m-auto relative">
        <div className="bg-[rgba(217,217,217,0.42)] rounded-t-[8px]">
          <div className="m-auto max-w-[330px] h-[260px] relative">
            <Image
              src={imageSrc}
              alt="doctor"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <div className="bg-white px-[10px] py-[18px] flex flex-col justify-between">
            <h6 className="text-[17px] mb-[5px] text-center">{doctorName}</h6>
            <div className="flex items-end justify-center">
              <p className="m-0 text-[14px] text-primary-darker font-medium">
                {doctorRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
