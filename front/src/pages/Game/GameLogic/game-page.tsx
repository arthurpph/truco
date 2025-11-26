const GamePage = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 opacity-5 text-white/20">
        <div className="absolute top-12 left-16 text-8xl rotate-12">♠</div>
        <div className="absolute top-24 right-24 text-7xl -rotate-12">♦</div>
        <div className="absolute bottom-16 left-24 text-8xl -rotate-6">♣</div>
        <div className="absolute bottom-24 right-16 text-7xl rotate-6">♥</div>
      </div>

      <div className="relative flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl font-black text-amber-400 tracking-tight">
          JOGO EM ANDAMENTO
        </h1>
        <p className="text-amber-200 text-lg mt-4">
          Lógica do jogo será implementada aqui
        </p>
      </div>
    </div>
  );
};

export default GamePage;
