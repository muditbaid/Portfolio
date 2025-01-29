import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
          <a 
            href="https://drive.google.com/file/d/1bJUc33cUqVo9rgFqvA3B-wQxVTp90N_l/view?usp=drive_link" 
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
        </div>
        <div className="nav-actions">
          <a href="https://github.com/muditbaid" target="_blank" rel="noopener noreferrer">
            <FaGithub style={{ color: '#f0f6fc' }} />
          </a>
          <a href="https://linkedin.com/in/mudit--baid" target="_blank" rel="noopener noreferrer">
            <FaLinkedin style={{ color: '#0077b5' }} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 