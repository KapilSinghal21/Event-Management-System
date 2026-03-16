import { motion } from 'framer-motion';

export default function Features() {
  const features = [
    {
      icon: "🎪",
      title: "Event Creation",
      description: "Create and manage events with ease. Add details, upload posters, and set capacities."
    },
    {
      icon: "🎫",
      title: "Digital Tickets",
      description: "Generate QR code-based digital tickets for seamless event check-in."
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description: "Track registrations, attendance, and engagement with detailed analytics."
    },
    {
      icon: "🔔",
      title: "Live Updates",
      description: "Get instant notifications about event changes and announcements."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Everything you need to create and manage successful events
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg shadow-indigo-500/5
                border border-slate-200 dark:border-slate-700 hover:border-indigo-500 
                dark:hover:border-indigo-400 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-600 dark:text-indigo-400">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}