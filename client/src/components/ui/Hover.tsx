import { motion } from 'framer-motion'

export function Hover({ component }: { component: string }) {
    return <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-100 rounded-md p-1 px-2 font-roboto z-50 text-xs absolute -top-8">
        {component}
    </motion.div>
}