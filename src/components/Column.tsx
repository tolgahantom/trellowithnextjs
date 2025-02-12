import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";
import TaskInput from "./TaskInput";

interface ColumnProps {
  column: { id: string; name: string };
  tasks: { id: string; title: string; statusId?: number }[];
  deleteBoard: (id: string) => void;
  addTask: (columnId: string, taskName: string) => void;
  newTaskName: { [key: string]: string };
  setNewTaskName: (newState: { [key: string]: string }) => void;
}

export default function Column({
  column,
  tasks,
  deleteBoard,
  addTask,
  newTaskName,
  setNewTaskName,
}: ColumnProps) {
  return (
    <Droppable droppableId={column.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-gray-200 p-4 rounded-lg"
        >
          <div className="flex justify-between items-center text-black">
            <h2 className="text-xl font-bold">{column.name}</h2>
            <button
              onClick={() => deleteBoard(column.id)}
              className="text-red-500"
            >
              🗑️
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
          <TaskInput
            columnId={column.id}
            addTask={addTask}
            newTaskName={newTaskName}
            setNewTaskName={setNewTaskName}
          />
        </div>
      )}
    </Droppable>
  );
}
