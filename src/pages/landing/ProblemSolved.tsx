import Problem from "../../components/landing/Problem"
import SectionHeader from "../../components/landing/SectionHeader"
import { BsQuestionCircleFill } from "react-icons/bs"

const ProblemSolved = ()=>{
    const healthProblemData = [
    {
        title: "Disorganized Health Records",
        tags: ["Missing medical history", "Unorganized records"],
        description: "Most individuals rely on scattered files, photos or paper documents to store vital health information. Prescriptions, test results, and doctor visit notes get lost in the chaos, making it difficult to provide a clear health history when it matters most.",
        imagePath: "/disorganizedRecords.svg"
    },
    {
        title: "No Single Health \"Meter\"",
        tags: ["No health score", "Fragmented tracking", "Lack of holistic view"],
        description: "We track steps, calories, or sleep—but there’s no central meter that gives a holistic view of your well-being. How do you know where your health stands today? Or where it’s heading tomorrow?",
        imagePath: "/noHealthMeter.svg"
    },
    {
        title: "Limited Tools for Long-Term Insight",
        tags: ["No long-term vision", "Disconnected health data", "Weak health insights"],
        description: "The market is flooded with trackers and apps, but few provide meaningful, long-term insights. Most tools lack continuity, context, or personalization—leaving people unaware of patterns that could lead to chronic issues or preventable conditions.",
        imagePath: "/limitedTools.svg"
    },
    {
        title: "Inaccessible, Inconsistent Guidance",
        tags: ["No health support", "Poor health guidance", "Lack of proactive care"],
        description: "People often lack access to consistent, quality-driven health guidance. Most don’t have the tools to monitor habits or interpret medical records. Health improvement remains a vague goal rather than an actionable path.",
        imagePath: "/noGuidance.svg"
    }
    ];
    return(
        <div className="h-full bg-black py-5">
            <SectionHeader icon={<BsQuestionCircleFill className="text-[#FF4A20]" />} preHeading="The Problem We Solve" heading="" subheading="" />
            <div className="flex flex-col gap-5">
                {healthProblemData.map((problem)=>(
                    <Problem key={problem.imagePath} title={problem.title} tags={problem.tags} description={problem.description} imagePath={problem.imagePath} />
                ))}
            </div>
        </div>
    )
}
export default ProblemSolved