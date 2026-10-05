import { motion } from 'framer-motion';

const BlogSection = () => {
  const blogs = [
    {
      title: "Optimizing Large-Scale ML Pipelines",
      date: "March 15, 2024",
      readTime: "8 min read",
      excerpt: "Best practices for building efficient and scalable machine learning pipelines in production environments.",
      tags: ["MLOps", "Optimization", "Production ML"],
      link: "#"
    },
    {
      title: "Deep Learning in Computer Vision",
      date: "March 1, 2024",
      readTime: "6 min read",
      excerpt: "Exploring recent advances in computer vision and practical applications in industry.",
      tags: ["Deep Learning", "Computer Vision", "AI"],
      link: "#"
    },
    {
      title: "The Future of AutoML",
      date: "February 20, 2024",
      readTime: "5 min read",
      excerpt: "How automated machine learning is evolving and its impact on the data science workflow.",
      tags: ["AutoML", "Future Tech", "AI"],
      link: "#"
    }
  ];

  return (
    <section id="blog" className="section blog-section">
      <h2 className="section-title">Latest Insights</h2>
      <div className="blog-grid">
        {blogs.map((blog, index) => (
          <motion.article 
            key={index}
            className="blog-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="blog-content">
              <div className="blog-meta">
                <span className="blog-date">{blog.date}</span>
                <span className="blog-read-time">{blog.readTime}</span>
              </div>
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-excerpt">{blog.excerpt}</p>
              <div className="blog-tags">
                {blog.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="blog-tag">{tag}</span>
                ))}
              </div>
              <a href={blog.link} className="blog-link">
                Read More →
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
