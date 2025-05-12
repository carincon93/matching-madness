import { useEffect, useState } from "react";
import { Card } from "./Card";

type Pair = {
  id: number;
  left: string;
  right: string;
};

type CardItem = {
  id: number;
  text: string;
};

const initialQueue: Pair[] = [
  { id: 1, left: "coche", right: "car" },
  { id: 2, left: "árbol", right: "tree" },
  { id: 3, left: "pájaro", right: "bird" },
  { id: 4, left: "bolsa", right: "bag" },
  { id: 5, left: "perro", right: "dog" },
  { id: 6, left: "gato", right: "cat" },
  { id: 7, left: "casa", right: "house" },
  { id: 8, left: "mesa", right: "table" },
  { id: 9, left: "silla", right: "chair" },
  { id: 10, left: "computadora", right: "computer" },
  { id: 11, left: "teléfono", right: "phone" },
  { id: 12, left: "libro", right: "book" },
  { id: 13, left: "pluma", right: "pen" },
  { id: 14, left: "ventana", right: "window" },
  { id: 15, left: "puerta", right: "door" },
];

export const MatchGame = () => {
  const [principalPairs, setPrincipalPairs] = useState<Pair[]>([]);
  const [queue, setQueue] = useState<Pair[]>([]);
  const [rest, setRest] = useState<Pair[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [correctPairs, setCorrectPairs] = useState(0);
  const [leftColumn, setLeftColumn] = useState<CardItem[]>([]);
  const [rightColumn, setRightColumn] = useState<CardItem[]>([]);
  const [selected, setSelected] = useState<{ left?: number; right?: number }>(
    {}
  );

  const [matchedIds, setMatchedIds] = useState<number[]>([]);

  useEffect(() => {
    if (principalPairs.length > 0) return;

    // Get 5 random pairs from initialQueue
    const randomPairs = initialQueue
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    setRest(initialQueue.filter((pair) => !randomPairs.includes(pair)));

    setPrincipalPairs(randomPairs);

    setQueue(randomPairs.slice(3, 5));

    setLeftColumn(
      randomPairs
        .slice(0, 3)
        .sort(() => Math.random() - 0.5)
        .map((pair) => ({ id: pair.id, text: pair.left }))
    );

    setRightColumn(
      randomPairs
        .slice(0, 3)
        .sort(() => Math.random() - 0.5)
        .map((pair) => ({ id: pair.id, text: pair.right }))
    );
  }, []);

  useEffect(() => {
    if (!selected.left || !selected.right) return;

    if (selected.left === selected.right) {
      setCorrectPairs((prev) => prev + 1);
      const leftIndex = leftColumn.findIndex(
        (pair) => pair.id === selected.left
      );

      const rightIndex = rightColumn.findIndex(
        (pair) => pair.id === selected.right
      );

      if (rest.length > 0) {
        setTimeout(() => {
          setLeftColumn((prev) => {
            const updated = [...prev]; // Clonamos el arreglo anterior
            updated[leftIndex] = {
              id: queue[queueIndex].id,
              text: queue[queueIndex].left,
            };
            return updated;
          });

          setRightColumn((prev) => {
            const updated = [...prev]; // Clonamos el arreglo anterior
            updated[rightIndex] = {
              id: queue[queueIndex === 1 ? 0 : 1].id,
              text: queue[queueIndex === 1 ? 0 : 1].right,
            };
            return updated;
          });
        }, 600);
      }

      setQueueIndex((prev) => (prev === 1 ? 0 : 1));

      setMatchedIds((prev) =>
        selected.left ? [...prev, selected.left] : prev
      );
    }

    setTimeout(() => {
      setSelected({ left: undefined, right: undefined });
    }, 650);
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
        {leftColumn.map((item) => (
          <Card
            key={item.id}
            text={item.text}
            rest={rest.length}
            onClick={() => {
              if (selected.left) return;
              setSelected({ ...selected, left: item.id });
            }}
            isMatched={matchedIds.includes(item.id)}
            isSelected={selected.left === item.id}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {rightColumn.map((item) => (
          <Card
            key={item.id}
            text={item.text}
            rest={rest.length}
            onClick={() => {
              if (selected.right) return;
              setSelected({ ...selected, right: item.id });
            }}
            isMatched={matchedIds.includes(item.id)}
            isSelected={selected.right === item.id}
          />
        ))}
      </div>
    </div>
  );
};
