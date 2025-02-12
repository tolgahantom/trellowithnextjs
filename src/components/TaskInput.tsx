interface TaskInputProps {
  columnId: string;
  addTask: (columnId: string, taskName: string) => void;
  newTaskName: { [key: string]: string };
  setNewTaskName: (newState: { [key: string]: string }) => void;
}

export default function TaskInput({
  columnId,
  addTask,
  newTaskName,
  setNewTaskName,
}: TaskInputProps) {
  return (
    <div className="flex items-center gap-3 mt-5">
      <input
        type="text"
        placeholder="Enter task name"
        value={newTaskName[columnId] || ""}
        onChange={(e) =>
          setNewTaskName({
            ...newTaskName,
            [columnId]: e.target.value,
          })
        }
        className="p-2 border rounded w-full text-black"
      />
      <button
        onClick={() => {
          if (newTaskName[columnId]?.trim()) {
            addTask(columnId, newTaskName[columnId]);
            setNewTaskName({
              ...newTaskName,
              [columnId]: "",
            });
          }
        }}
        className="p-2 bg-blue-500 text-white rounded w-[50px]"
      >
        +
      </button>
    </div>
  );
}
