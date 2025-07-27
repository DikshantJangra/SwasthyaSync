interface HealthProblem {
    title: string;
    tags: string[];
    description: string;
    imagePath: string;
  }
  
  const Problem = ({ title, tags, description, imagePath }: HealthProblem) => {
    return (
      <div className="grid sm:grid-rows-1 grid-rows-2 sm:grid-cols-[40%_60%] mx-10 rounded-2xl overflow-hidden text-white">
        <div className="bg-black h-90">
          <img src={imagePath} className="h-full w-full object-cover" alt={title} />
        </div>
        <div className="h-90 px-5 py-4 flex flex-col">
          <div className="flex gap-2 flex-wrap mb-2">
            {tags.map((tag, index) => (
              <div key={index} className="border border-white rounded-2xl px-2 py-1">
                {tag}
              </div>
            ))}
          </div>
          <p className="font-bold text-3xl mb-2">{title}</p>
          <p className="text-lg leading-5 max-w-160">{description}</p>
        </div>
      </div>
    );
  };
  
  export default Problem;
  