type CardProps = {
  text: string;
  onClick: () => void;
  isMatched: boolean;
  isSelected: boolean;
  rest: number;
};

export const Card = ({
  text,
  onClick,
  isMatched,
  isSelected,
  rest,
}: CardProps) => {
  return (
    <button
      onClick={onClick}
      className={`${isMatched ? "animate-fade-out" : "animate-fade-in"}`}
      style={{
        borderColor: isMatched ? "#caeca7" : isSelected ? "#82d3fc" : "#e8e8e6",
        boxShadow: isMatched
          ? "0 4px 0 #58a700"
          : isSelected
          ? "0 4px 0 #82d3fc"
          : "0 4px 0 #e8e8e6",

        opacity: isMatched ? 0.5 : 1,
        backgroundColor: isMatched
          ? "#ddf9c2"
          : isSelected
          ? "#dbf3ff"
          : "transparent",

        animationDuration: "800ms",
        animationDelay: "100ms",
      }}
      disabled={rest === 0 && isMatched}
    >
      {text}
    </button>
  );
};
