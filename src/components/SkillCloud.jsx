import { FaPython, FaDocker, FaAws, FaGitAlt, FaDatabase } from 'react-icons/fa';
import { SiTensorflow, SiPytorch, SiJupyter, SiFlask, SiJenkins, SiMongodb, SiScikitlearn, SiKubernetes, SiApachekafka } from 'react-icons/si';

const SkillCloud = () => {
  const skills = [
    { name: "Python", icon: <FaPython />, color: "#3776AB" },
    { name: "TensorFlow", icon: <SiTensorflow />, color: "#FF6F00" },
    { name: "PyTorch", icon: <SiPytorch />, color: "#EE4C2C" },
    { name: "Jupyter", icon: <SiJupyter />, color: "#F37626" },
    { name: "Flask", icon: <SiFlask />, color: "#000000" },
    { name: "Docker", icon: <FaDocker />, color: "#2496ED" },
    { name: "AWS", icon: <FaAws />, color: "#FF9900" },
    { name: "Git", icon: <FaGitAlt />, color: "#F05032" },
    { name: "Jenkins", icon: <SiJenkins />, color: "#D24939" },
    { name: "MongoDB", icon: <SiMongodb />, color: "#47A248" },
    { name: "SQL", icon: <FaDatabase />, color: "#4479A1" },
    { name: "Scikit-learn", icon: <SiScikitlearn />, color: "#F7931E" },
    { name: "Kubernetes", icon: <SiKubernetes />, color: "#326CE5" },
    { name: "Kafka", icon: <SiApachekafka />, color: "#231F20" },
  ];

  return (
    <div className="skill-cloud">
      {skills.map((skill, index) => (
        <div 
          key={index} 
          className="skill-tag"
          style={{ backgroundColor: skill.color }}
        >
          {skill.icon}
          <span>{skill.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SkillCloud;
