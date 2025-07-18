type Icons = {
    path: string;
    alt: string;
}
const Hero = ()=>{
    const imgIcons: Icons[] = [
        {path:"healthRecords.svg", alt:"Store Health Records"},
        {path:"healthTrack.svg", alt:"Health Tracking & Analysis"},
        {path:"healthVault.svg", alt:"Private Health Vault"},
        {path:"healthAccess.svg", alt:"Temporary Docs Sharing"},
    ]
    return(
        <div className="h-[100dvh] flex flex-col text-white">
            <div className="h-[70dvh] bg-[#FF4A20] px-10 py-5">
                <div className="flex justify-start items-center gap-2 fixed">
                    <img src="/ssicon.svg" alt="Swāsthya Sync" className="h-15" />
                    <h1 className="font-bold text-4xl">Swāsthya Sync</h1>
                </div>

                <div className="grid grid-cols-[60%_40%] grid-rows-1 h-full">
                    <div className="flex justify-center flex-col py-8 pr-15 gap-4">
                        <p className="font-bold leading-none text-6xl">Swāsthya Sync — <br />Your Health, In Sync</p>
                        <p className="text-xl">Join a new era of health-conscious individuals tracking, syncing, and improving their health the right way.</p>

                        <button className="flex items-center bg-white px-3 py-2 text-black font-semibold w-fit rounded-lg cursor-pointer hover:bg-white/70 transition-all duration-300">Build Your Own Health Vault <span className="text-xl">→</span></button>
                    </div>
                    <div className="flex justify-center">
                        <img src="/ssPhone.svg" alt="Swāsthya Sync Mobile App" className="h-145" />
                    </div>
                </div>
            </div>
            <div className="h-[30dvh] bg-black py-5">
                <div className="flex flex-col items-center">
                    <p className="font-semibold text-4xl">Built for People Who Care About Their Health</p>
                    <p className="text-xl">“Made for People Who Believe That What Gets Measured, Gets Managed.”</p>
                </div>

                <div className="pt-8 flex justify-center items-center gap-35">
                    {
                        imgIcons.map((item, idx)=>(
                            <div className="flex flex-col justify-center items-center" key={idx}>
                                <div className="h-22">
                                    <img src={item.path} alt={item.alt} className="h-full bg-cover bg-center" />
                                </div>
                                <p className="pt-2 font-semibold">{item.alt}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default Hero