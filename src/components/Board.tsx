"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Column from "./Column";

export default function Board() {
  const [columns, setColumns] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [newTaskName, setNewTaskName] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchData() {
      const { data: columnsData } = await supabase.from("columns").select("*");
      setColumns(columnsData || []);

      const { data: cardsData } = await supabase.from("cards").select("*");
      setCards(cardsData || []);
    }
    fetchData();
  }, []);

  async function addBoard() {
    if (!newBoardName) return;
    const { data } = await supabase
      .from("columns")
      .insert([{ name: newBoardName }])
      .select();
    if (data) setColumns([...columns, ...data]);
    setNewBoardName("");
  }

  async function addTask(columnId: string) {
    if (!newTaskName[columnId]) return;
    const { data } = await supabase
      .from("cards")
      .insert([{ title: newTaskName[columnId], column_id: columnId }])
      .select();
    if (data) setCards([...cards, ...data]);
    setNewTaskName({ ...newTaskName, [columnId]: "" });
  }

  async function deleteBoard(boardId: string) {
    await supabase.from("columns").delete().match({ id: boardId });
    setColumns(columns.filter((col) => col.id !== boardId));
    setCards(cards.filter((card) => card.column_id !== boardId));
  }

  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const updatedCards = [...cards];

    const draggedCardIndex = updatedCards.findIndex(
      (card) => card.id.toString() === draggableId
    );
    const draggedCard = updatedCards.splice(draggedCardIndex, 1)[0];
    draggedCard.column_id = destination.droppableId;
    updatedCards.splice(destination.index, 0, draggedCard);

    setCards(updatedCards);

    const { error } = await supabase
      .from("cards")
      .update({ column_id: destination.droppableId })
      .match({ id: draggableId });

    if (error) {
      console.error("Hata oluştu:", error);
      alert("Kartı taşırken hata oluştu.");
      setCards(cards);
    }
  }

  return (
    <div className="p-5">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          className="p-2 border rounded w-full text-black"
        />
        <button
          onClick={addBoard}
          className="bg-green-500 text-white px-4 py-2 rounded font-bold text-xl"
        >
          +
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={cards.filter((card) => card.column_id === col.id)}
              deleteBoard={deleteBoard}
              addTask={addTask}
              newTaskName={newTaskName}
              setNewTaskName={setNewTaskName}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
