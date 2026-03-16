import { motion } from 'framer-motion';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Organizer",
      content: "This platform has transformed how we manage events. The digital tickets and real-time analytics are game-changers.",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      name: "Michael Chen",
      role: "Tech Conference Host",
      content: "The automated check-in system and QR codes have made our events much more professional and efficient.",
      image: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      name: "Emily Williams",
      role: "Community Manager",
      content: "Our community events have seen a 50% increase in attendance since we started using this platform.",
      image: "https://randomuser.me/api/portraits/women/3.jpg"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Join thousands of satisfied event organizers and attendees
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg shadow-indigo-500/5
                border border-slate-200 dark:border-slate-700 hover:border-indigo-500
                dark:hover:border-indigo-400 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-indigo-500"
                />
                <div className="ml-4">
                  <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 italic">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}