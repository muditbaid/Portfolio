import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import HeroSection from './components/HeroSection';
import ProjectCard from './components/ProjectCard';
import SkillCloud from './components/SkillCloud';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import Navbar from './components/Navbar';

const App = () => {
  const [projects] = useState([
    {
      title: " Context-Aware Toxicity Benchmarking",
      tech: "NLP · BERT · Model Generalization · Twitter API · HuggingFace",
      description: "Benchmarking toxicity detection by analyzing contextual impact across multiple harmful speech categories.",
      link: "#",
      metrics: ["MAPE: 6.2%", "ROI: 142%"],
      visualization: "/assets/wordcloud.jpg"
    },
    {
      title: "Semantic Knowledge Graph from Covid ResearchCorpus",
      tech: "NLP · Spacy · Neo4j · LLM",
      description: "Constructing a semantic knowledge graph from COVID-19 text corpora to improve Large Language time series forecasting Models.",
      link: "#",
      metrics: ["Precision: 94%", "Recall: 89%"],
      visualization: "/assets/kgraph.png"
    },
    {
      title: "Active Semantic Segmentation",
      tech: "Neural Networks · PyTorch · Active Learning · OpenCV",
      description: "Developed an active learning pipeline for semantic segmentation using UNet, applying Patchwise and Pixelwise entropy to refine annotations with human-in-the-loop corrections.",
      link: "#",
      metrics: ["Accuracy: 91%", "F1 Score: 0.89"],
      visualization: "/assets/segment.jpeg"
    },
    {
      title: "Discord Mental Health Chatbot",
      tech: "fastAPI · Python · Streamlit",
      description: "Developed and hosted real-time mental health chatbot on Discord.",
      link: "#",
      metrics: ["mAP: 0.86", "FPS: 30"],
      visualization: "/assets/amigo.jpg"
    }
  ]);

  const [skills] = useState([
    { name: "Python", level: 95 },
    { name: "Deep Learning", level: 90 },
    { name: "AWS", level: 85 },
    { name: "SQL", level: 92 },
    { name: "Spark", level: 88 },
    { name: "Docker", level: 85 },
    { name: "MLOps", level: 87 },
    { name: "Computer Vision", level: 83 }
  ]);

  return (
    <HelmetProvider>
      <div className="portfolio-container">
        <Navbar />
        <Helmet>
          <title>Mudit Baid</title>
          <meta name="description" content="Building production-grade machine learning systems" />
        </Helmet>

        <HeroSection />
        
        <section id="projects" className="section projects-section">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <h2 className="section-title">Technical Expertise</h2>
          <SkillCloud skills={skills} />
        </section>

        <BlogSection />
        
        <ContactSection />
      </div>
    </HelmetProvider>
  );
};

export default App;
