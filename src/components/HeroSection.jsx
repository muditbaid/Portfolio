import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFileDownload } from 'react-icons/fa';
import { useEffect, useRef, useCallback } from 'react';
import Typed from 'typed.js';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const HeroSection = () => {
  const el = useRef(null);
  const typed = useRef(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const options = {
      strings: [
        "Hi! The name's Mudit",
        "I_like_to_code.py </>",
        "I like listening to 🎵"
      ],
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 2000,
      loop: true,
      cursorChar: '|'
    };

    typed.current = new Typed(el.current, options);

    return () => {
      typed.current.destroy();
    };
  }, []);

  return (
    <section className="hero-section">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: {
            enable: true,
            zIndex: -1
          },
          background: {
            color: {
              value: "#000000",
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: "#F0C808"
            },
            links: {
              color: "#F0C808",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: false,
              straight: false,
              outModes: {
                default: "bounce"
              }
            },
            number: {
              density: {
                enable: true,
                area: 800
              },
              value: 80
            },
            opacity: {
              value: 0.7
            },
            shape: {
              type: "circle"
            },
            size: {
              value: { min: 1, max: 3 }
            }
          },
          detectRetina: true,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse"
              }
            },
            modes: {
              repulse: {
                distance: 150,
                duration: 0.4
              }
            }
          }
        }}
      />
      <div className="hero-content">
        <div className="hero-text-container">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Machine Learning Engineer</h1>
            <div className="typing-container">
              <span ref={el} className="typed-text"></span>
            </div>
          </motion.div>
        </div>
        <motion.div 
          className="profile-image-container"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src="https://raw.githubusercontent.com/muditbaid/muditbaid/main/assets/mb.jpg" alt="Mudit Baid" className="profile-image" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
