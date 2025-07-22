// function App() {
//     return (
//       <>
//         <div className="h-screen bg-black text-white">
//         <header className='grid grid-cols-3 py-6 px-4 font-Poppins'>
//           <nav className='flex col-span-2 justify-self-end items-end gap-5'>
//               <img src={'/swasthyasync.svg'} height={40} width={40} alt='Swasthya Sync'></img>
//               <span className='text-[2.6vmax] font-black text-[#FF4A20]'>Swāsthya Sync</span>
//           </nav>
//         <div className="flex gap-5 self-center justify-self-end">
//           {/* <a href={'/Login'}><LoginButton /></a> */}
//           {/* <a href={'/Signup'}><SignupButton /></a> */}
//         </div>
//         </header>

import { useEffect } from "react"
import Hero from "../components/landing/Hero"
import { supabase } from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"

  
//         <div className="relative flex flex-col items-center mt-45">
//           <div className="">
//             <p className="uppercase font-bold text-8xl">SYNC</p>
//             <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] border-t-[1px] w-100"></div>
//           </div>
//         </div>
  
//         <div className="flex justify-center items-center gap-8 mt-1 font-bold text-[6vmax] text-[#FF4A20]">
//           <span className="drop-shadow-lg drop-shadow-white/50 opacity-50 block sm:inline">BODY</span>
//           <span className="drop-shadow-lg drop-shadow-white/50  block sm:inline">SPIRIT</span>
//           <span className="drop-shadow-lg drop-shadow-white/50 opacity-50  block sm:inline">MIND</span>
  
//         </div>
//           <div className="text-center">
//           <p className="text-2xl">"When your body and mind are in sync, wellness follows naturally. <br />
//           Start your journey with Swāsthya Sync."</p>
//           <a href={'/Signup'}><button className='mt-8 px-4 py-2 bg-[#FF4A20]/90 text-white font-semibold rounded-2xl hover:cursor-pointer hover:bg-[#FF4A20] hover:scale-105 transition-all duration-300'>Start Syncing</button></a>
//           </div>
//         </div>
//       </>
//     )
//   }
  
//   export default App
  

const Index = () => {
  return (
    <div className="font-Poppins">
        <Hero />
    </div>
  )
}

export default Index