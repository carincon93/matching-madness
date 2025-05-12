import { useEffect, useState } from "react";
import { Card } from "./Card";
import ReactHowler from "react-howler";

type Pair = {
  id: string;
  translation: string;
  word: string;
};

type CardItem = {
  id: string;
  text: string;
};

type MatchingGameProps = {
  pairs: Pair[];
};

export const MatchingGame = ({ pairs }: MatchingGameProps) => {
  const [soundSrc, setSoundSrc] = useState<string | null>(null);
  const [playSound, setPlaySound] = useState(false);
  const [principalPairs, setPrincipalPairs] = useState<Pair[]>([]);
  const [queue, setQueue] = useState<Pair[]>([]);
  const [rest, setRest] = useState<Pair[]>([]);
  const [combo, setCombo] = useState<number>(0);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [correctPairs, setCorrectPairs] = useState<number>(0);
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
  const [translationColumn, setTranslationColumn] = useState<CardItem[]>([]);
  const [wordColumn, setRightColumn] = useState<CardItem[]>([]);
  const [selected, setSelected] = useState<{
    translation?: string;
    word?: string;
  }>({});

  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  useEffect(() => {
    if (principalPairs.length > 0) return;

    setSoundSrc("/matching-madness/sounds/correct.ogg");

    // Get 7 random pairs from initialQueue
    const randomPairs = pairs.sort(() => Math.random() - 0.5).slice(0, 7);

    setRest(pairs.filter((pair) => !randomPairs.includes(pair)));

    setPrincipalPairs(randomPairs);

    setQueue(randomPairs.slice(5, 7));

    setTranslationColumn(
      randomPairs
        .slice(0, 5)
        .sort(() => Math.random() - 0.5)
        .map((pair) => ({ id: pair.id, text: pair.translation }))
    );

    setRightColumn(
      randomPairs
        .slice(0, 5)
        .sort(() => Math.random() - 0.5)
        .map((pair) => ({ id: pair.id, text: pair.word }))
    );
  }, []);

  useEffect(() => {
    if (!selected.translation || !selected.word) return;
    setPlaySound(false);
    setCombo((prev) => prev + 1);

    if (selected.translation === selected.word) {
      setPlaySound(true);
      setCorrectPairs((prev) => prev + 1);

      const translationIndex = translationColumn.findIndex(
        (pair) => pair.id === selected.translation
      );

      const wordIndex = wordColumn.findIndex(
        (pair) => pair.id === selected.word
      );

      if (rest.length > 0) {
        setTimeout(() => {
          setTranslationColumn((prev) => {
            const updated = [...prev]; // Clonamos el arreglo anterior
            updated[translationIndex] = {
              id: queue[queueIndex].id,
              text: queue[queueIndex].translation,
            };
            return updated;
          });

          setRightColumn((prev) => {
            const updated = [...prev]; // Clonamos el arreglo anterior
            updated[wordIndex] = {
              id: queue[queueIndex === 1 ? 0 : 1].id,
              text: queue[queueIndex === 1 ? 0 : 1].word,
            };
            return updated;
          });
        }, 600);
      }

      setQueueIndex((prev) => (prev === 1 ? 0 : 1));

      setMatchedIds((prev) =>
        selected.translation ? [...prev, selected.translation] : prev
      );
    } else {
      setIsIncorrect(true);
      setCombo(0);
    }

    setTimeout(() => {
      setSelected({ translation: undefined, word: undefined });
      setIsIncorrect(false);
    }, 250);
  }, [selected]);

  useEffect(() => {
    if (correctPairs < 2) return;

    const newQueue = rest.sort(() => Math.random() - 0.5).slice(0, 2);
    const newRest = rest.filter(
      (rest) => ![newQueue[0]?.id, newQueue[1]?.id].includes(rest.id)
    );

    setQueue(newQueue);
    setRest(newRest);
    setCorrectPairs(0);
  }, [correctPairs]);

  return (
    <div>
      {/* {combo > 4 && ( */}
      <h4
        id="combo-nro"
        key={combo}
        className={`font-bold font text-pink-600 text-xl absolute top-20 left-0 right-0 mx-auto z-50 items-center justify-center gap-2 ${
          combo ? "animate-fade-in flex" : "animate-fade-out hidden"
        }`}
        onAnimationEnd={() => {
          const element = document.querySelector("#combo-nro");
          if (element) {
            setTimeout(() => {
              element.classList.remove("animate-fade-in");
              element.classList.add("animate-fade-out");
            }, 300);

            setTimeout(() => {
              element.classList.add("hidden");
            }, 800);
          }
        }}
      >
        Combo <span>{combo}x</span>
      </h4>
      {/* )} */}
      <div className="grid grid-cols-2 gap-4">
        {soundSrc && (
          <div className="hidden">
            <ReactHowler
              src={soundSrc}
              playing={playSound}
              onEnd={() => setPlaySound(false)}
            />
          </div>
        )}
        <div className="flex flex-col gap-4">
          {translationColumn.map((item) => (
            <Card
              key={item.id}
              text={item.text}
              rest={rest.length}
              onClick={() => {
                if (selected.translation === item.id)
                  setSelected({ ...selected, translation: undefined });

                if (selected.translation) return;
                setSelected({ ...selected, translation: item.id });
              }}
              isIncorrect={isIncorrect}
              isMatched={matchedIds.includes(item.id)}
              isSelected={selected.translation === item.id}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {wordColumn.map((item) => (
            <Card
              key={item.id}
              text={item.text}
              rest={rest.length}
              onClick={() => {
                if (selected.word === item.id)
                  setSelected({ ...selected, word: undefined });
                if (selected.word) return;
                setSelected({ ...selected, word: item.id });
              }}
              isIncorrect={isIncorrect}
              isMatched={matchedIds.includes(item.id)}
              isSelected={selected.word === item.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
