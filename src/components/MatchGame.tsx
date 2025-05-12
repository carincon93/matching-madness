import { useEffect, useState } from "react";
import { Card } from "./Card";
import { pairs } from "@/data/pairs";

type Pair = {
  id: string;
  translation: string;
  word: string;
};

type CardItem = {
  id: string;
  text: string;
};

const pairsByWeek = (week: number) =>
  pairs.filter((pair) => pair.week === week);

const initialQueue: Pair[] = pairsByWeek(1);

export const MatchGame = () => {
  const [principalPairs, setPrincipalPairs] = useState<Pair[]>([]);
  const [queue, setQueue] = useState<Pair[]>([]);
  const [rest, setRest] = useState<Pair[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [correctPairs, setCorrectPairs] = useState(0);
  const [translationColumn, setTranslationColumn] = useState<CardItem[]>([]);
  const [wordColumn, setRightColumn] = useState<CardItem[]>([]);
  const [selected, setSelected] = useState<{
    translation?: string;
    word?: string;
  }>({});

  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  useEffect(() => {
    if (principalPairs.length > 0) return;

    // Get 5 random pairs from initialQueue
    const randomPairs = initialQueue
      .sort(() => Math.random() - 0.5)
      .slice(0, 7);

    setRest(initialQueue.filter((pair) => !randomPairs.includes(pair)));

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

    if (selected.translation === selected.word) {
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
    }

    setTimeout(() => {
      setSelected({ translation: undefined, word: undefined });
    }, 50);
  }, [selected]);

  useEffect(() => {
    if (correctPairs < 2) return;

    const newQueue = rest.sort(() => Math.random() - 0.5).slice(0, 2);
    console.log("newQueue", newQueue);
    const newRest = rest.filter(
      (rest) => ![newQueue[0].id, newQueue[1].id].includes(rest.id)
    );
    console.log("newRest", newRest);

    setQueue(newQueue);
    setRest(newRest);
    setCorrectPairs(0);
  }, [correctPairs]);

  return (
    <div className="w-6/12 mx-auto grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        {translationColumn.map((item) => (
          <Card
            key={item.id}
            text={item.text}
            rest={rest.length}
            onClick={() => {
              if (selected.translation) return;
              setSelected({ ...selected, translation: item.id });
            }}
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
              if (selected.word) return;
              setSelected({ ...selected, word: item.id });
            }}
            isMatched={matchedIds.includes(item.id)}
            isSelected={selected.word === item.id}
          />
        ))}
      </div>
    </div>
  );
};
