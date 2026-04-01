import Hero from "@/components/landing/Hero";
import ProblemSolved from "@/components/landing/ProblemSolved";
import Solution from "@/components/landing/Solution";

export default function Page() {
    return (
        <div className="font-poppins bg-black overflow-x-hidden">
            <Hero />
            <ProblemSolved />
            <Solution />
        </div>
    );
}
