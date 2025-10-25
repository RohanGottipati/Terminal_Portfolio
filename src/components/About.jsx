import React from 'react'
import { motion } from 'framer-motion'
import { Code, Database, Smartphone, Globe } from 'lucide-react'

const About = () => {
  const skills = [
    { icon: Code, title: 'Frontend Development', description: 'React, Next.js, Vue.js, TypeScript' },
    { icon: Database, title: 'Backend Development', description: 'Node.js, Python, Express, FastAPI' },
    { icon: Smartphone, title: 'Mobile Development', description: 'React Native, Flutter, iOS, Android' },
    { icon: Globe, title: 'Full-Stack Solutions', description: 'End-to-end application development' }
  ]

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            I'm a passionate full-stack developer with a love for creating innovative solutions 
            and bringing ideas to life through code.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-white mb-6">My Journey</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              With a strong foundation in computer science and years of hands-on experience, 
              I specialize in building scalable web applications and mobile solutions. 
              I'm passionate about clean code, user experience, and continuous learning.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              When I'm not coding, you can find me exploring new technologies, 
              contributing to open-source projects, or sharing knowledge with the developer community.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <span className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30">
                Problem Solver
              </span>
              <span className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-full border border-purple-600/30">
                Team Player
              </span>
              <span className="px-4 py-2 bg-green-600/20 text-green-400 rounded-full border border-green-600/30">
                Continuous Learner
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
              >
                <skill.icon className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">{skill.title}</h4>
                <p className="text-gray-400 text-sm">{skill.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
