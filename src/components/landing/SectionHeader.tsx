import type React from "react";

type SectionHeaderProps = {
  icon?: React.ReactNode;
  preHeading: string;
  highlight?: string;

  heading: string;
  subheading: string;
};

const SectionHeader = ({ icon, preHeading, highlight = "", heading, subheading }: SectionHeaderProps) => {
  return (
    <div className="flex flex-col  justify-center items-center text-base font-normal text-center text-white">
        {/* Preheading Badge */}
        <div className="flex justify-center items-center tracking-wider gap-2 bg-white/10 px-3 py-1 rounded-lg mb-12 text-sm sm:text-base">
            {icon && <span className="text-xl">{icon}</span>}
            <span>
                {highlight ? (
                <>
                    {preHeading} <span className="text-[#FF4A20]">{highlight}</span>
                </>
                ) : (
                preHeading
                )}
            </span>
        </div>

        <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FF4A20]">{heading}</p>
        <p className="text-base sm:text-2xl text-white/80">{subheading}</p>
    </div>
  );
};
 
export default SectionHeader;