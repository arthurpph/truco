import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface AnimatedPageProps {
    children: ReactNode;
    startDirection?: 'left' | 'right';
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({
    children,
    startDirection,
}) => {
    const animations = {
        initial: { opacity: 0, x: startDirection === 'right' ? 500 : -500 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: startDirection === 'right' ? 500 : -500 },
    };

    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="h-full"
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
