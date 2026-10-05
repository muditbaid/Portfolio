import { motion } from "framer-motion";

const ProjectCard = ({ project }) => {
  return (
    <motion.div 
      className="project-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="project-visual">
        <img src={project.visualization} alt={project.title} />
      </div>
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-tech">{project.tech}</p>
        <p className="project-description">{project.description}</p>
        <div className="project-metrics">
          {project.metrics.map((metric, index) => (
            <span key={index} className="metric-badge">{metric}</span>
          ))}
        </div>
        <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
          View Project →
        </a>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
