import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchingGame } from "@/components/MatchingGame";
import { PairsDataTable } from "./_data-table";
import { pairs, type Pair } from "@/data/pairs";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Play } from "lucide-react";

export const GameTabs = () => {
  const [pairsByWeek, setPairsByWeek] = useState<Pair[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(true);

  const getPairsByWeek = (week: number) =>
    pairs.filter((pair) => pair.week === week);

  useEffect(() => {
    if (!selectedWeek) return;

    setOpenDialog(false);

    setPairsByWeek(getPairsByWeek(selectedWeek));
  }, [selectedWeek]);

  return (
    <div>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select a Week</AlertDialogTitle>
            <AlertDialogDescription>
              Please select a week to start playing the matching game or view
              the word list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Select
            value={selectedWeek?.toString()}
            onValueChange={(value) => setSelectedWeek(Number(value))}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Week" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((week) => (
                <SelectItem key={week} value={week.toString()}>
                  Week {week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedWeek && (
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="game">
              <Play /> Game
            </TabsTrigger>
            <TabsTrigger value="list">All words</TabsTrigger>
          </TabsList>
          <TabsContent value="game">
            <MatchingGame pairs={pairsByWeek} />
          </TabsContent>
          <TabsContent value="list">
            <PairsDataTable
              pairs={pairs.toSorted((a, b) => a.word.localeCompare(b.word))}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
