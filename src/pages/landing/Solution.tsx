import { Link } from "react-router-dom"
import SectionHeader from "../../components/landing/SectionHeader"

const Solution = ()=>{
    return(
        <div className="bg-black flex flex-col justify-center items-center py-5 text-white">
            <SectionHeader icon={<img src="/ssicon.svg" className="h-7" />} preHeading="The Solution: " highlight="How Swāsthya Sync Works" heading="A Simple Unified Health Intelligence Platform" subheading="A smarter way to understand, manage, and elevate your health." />
            <div className="py-5">
                <img src="/ssWorking.svg" alt="Swasthya Sync working" />
            </div>
            <Link
                to={"/SignUp"}
                className="px-4 py-3 text-black bg-white rounded-lg font-semibold hover:bg-[#FF4A20] hover:text-white transition-all duration-400 hover:scale-110"
            >
                Get Started → 
            </Link>

            <p className="text-center py-10 pt-20 font-semibold">© 2025 Swāsthya Sync</p>
        </div>
    )
}
export default Solution