import { Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface TaskProps {
  task: { id: string; title: string; statusId?: number };
  index: number;
}

export default function Task({ task, index }: TaskProps) {
  const [statusTitle, setStatusTitle] = useState<string | null>(null);
  const [statusId, setStatusId] = useState<number>(task.statusId ?? 1);

  const getStatusColor = (statusId?: number) => {
    switch (statusId) {
      case 1:
        return "bg-red-200";
      case 2:
        return "bg-yellow-200";
      case 3:
        return "bg-green-200";
      default:
        return "bg-gray-200";
    }
  };

  const handleStatusClick = async () => {
    if (statusId < 3) {
      const newStatusId = statusId + 1;
      setStatusId(newStatusId);

      const { error } = await supabase
        .from("cards")
        .update({ statusId: newStatusId })
        .eq("id", task.id);

      if (error) {
        console.error(error.message);
      }
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("cards").delete().eq("id", task.id);

    if (error) {
      console.error("Görev silinirken hata oluştu:", error);
    } else {
      console.log(`Görev silindi: ${task.id}`);
    }
  };

  useEffect(() => {
    if (!statusId || isNaN(Number(statusId))) {
      return;
    }

    async function fetchStatus() {
      const { data, error } = await supabase
        .from("status")
        .select("title")
        .eq("id", statusId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setStatusTitle(data.title);
      }
    }

    fetchStatus();
  }, [statusId]);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-3 bg-white rounded shadow text-black"
        >
          <div className="flex flex-col">
            <div className="flex justify-between">
              <span
                className={`text-sm font-bold inline rounded-full w-[100px] text-center mb-3 p-1 cursor-pointer ${getStatusColor(
                  statusId
                )}`}
                onClick={handleStatusClick}
              >
                {statusTitle}
              </span>
              <span className="cursor-pointer" onClick={handleDelete}>
                🗑️
              </span>
            </div>

            <span>{task.title}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
