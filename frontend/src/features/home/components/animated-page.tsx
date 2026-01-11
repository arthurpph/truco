import { motion } from 'framer-motion';

const AnimatedPage = ({
    children,
    startDirection,
}: {
    children: React.ReactNode;
    startDirection: string;
}) => {
    const variants = {
        initial: {
            x: startDirection === 'left' ? -100 : 100,
            opacity: 0,
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.4 },
        },
        exit: {
            x: startDirection === 'left' ? 100 : -100,
            opacity: 0,
            transition: { duration: 0.3 },
        },
    };

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
