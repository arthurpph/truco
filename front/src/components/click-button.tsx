import clickSound from "../assets/clicksound.mp3";

interface ClickButtonProps {
  name: string;
  defaultStyles?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const ClickButton: React.FC<ClickButtonProps> = ({
  name,
  defaultStyles,
  onClick,
}) => {
  const clickSoundAudio = new Audio(clickSound);

  const playClickSound = () => {
    clickSoundAudio.play();
  };

  return (
    <button
      onClick={(event) => {
        playClickSound();
        onClick?.(event);
      }}
      className={defaultStyles}
    >
      {name}
    </button>
  );
};

export default ClickButton;
