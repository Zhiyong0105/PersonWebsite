import Project from "./Project";
import { projectsData } from "./lib/data";

export default function Projects(){
      return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
        My Projects
      </h1>
      <div className="flex flex-col items-center gap-12">
        {projectsData.map((project, index) => (
          <Project key={index} {...project} />
        ))}
      </div>
    </div>
  );
}