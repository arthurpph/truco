import { ReactNode } from 'react';
import clickSound from '../../../assets/clicksound.mp3';

interface ClickDivProps {
    defaultStyles?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    children?: ReactNode;
}

const ClickDiv: React.FC<ClickDivProps> = ({
    defaultStyles,
    onClick,
    children,
}) => {
    const clickSoundAudio = new Audio(clickSound);

    const playClickSound = () => {
        clickSoundAudio.play();
    };

    return (
        <div
            onClick={(event) => {
                playClickSound();
                onClick?.(event);
            }}
            className={defaultStyles}
        >
            {children}
        </div>
    );
};

export default ClickDiv;
