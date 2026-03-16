import { motion } from 'framer-motion';

export default function Stats() {
  const stats = [
    {
      number: "10K+",
      label: "Events Created",
      icon: "📅"
    },
    {
      number: "50K+",
      label: "Active Users",
      icon: "👥"
    },
    {
      number: "95%",
      label: "Satisfaction Rate",
      icon: "⭐"
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: "💬"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-indigo-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}