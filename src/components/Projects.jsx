import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'

const Projects = () => {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      github: 'https://github.com/RohanGottipati/ecommerce',
      live: 'https://ecommerce-demo.vercel.app'
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application built with React and Firebase. Real-time updates and team collaboration features.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'Firebase', 'Tailwind CSS'],
      github: 'https://github.com/RohanGottipati/task-manager',
      live: 'https://task-manager-demo.vercel.app'
    },
    {
      title: 'Weather Dashboard',
      description: 'A responsive weather application with location-based forecasts and interactive maps. Built with modern web technologies.',
      image: '/api/placeholder/600/400',
      technologies: ['Vue.js', 'OpenWeather API', 'Chart.js'],
      github: 'https://github.com/RohanGottipati/weather-app',
      live: 'https://weather-dashboard.vercel.app'
    },
    {
      title: 'Portfolio Website',
      description: 'This interactive portfolio website showcasing projects and skills. Built with React, Three.js, and modern animations.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
      github: 'https://github.com/RohanGottipati/Portfolio',
      live: 'https://rohangottipati.vercel.app'
    }
  ]

  return (
    <section id="projects" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A collection of projects that showcase my skills and passion for development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Code className="w-8 h-8" />
                  </div>
                  <p className="text-sm">Project Preview</p>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-600/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Github size={18} />
                    <span>Code</span>
                  </motion.a>
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>Live Demo</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
