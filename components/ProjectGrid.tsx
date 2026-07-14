import Link from 'next/link';

export interface Project {
  id: string;
  title: string;
  created_at: string;
}

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return <p className="text-writer-navy/60">No projects yet. Create one to get started!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link 
          key={project.id} 
          href={`/projects/${project.id}`}
          className="group block p-6 bg-white border-2 border-writer-beige rounded-xl hover:border-writer-navy transition-colors shadow-sm hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-writer-navy group-hover:text-writer-navy/80">
            {project.title}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Created {new Date(project.created_at).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
  );
}