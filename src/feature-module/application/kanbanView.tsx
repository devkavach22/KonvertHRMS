import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
  type DraggableProvided,
  type DroppableProvided,
} from "@hello-pangea/dnd";
import { useState } from "react";
import { Link } from "react-router";
import ImageWithBasePath from "../../core/common/imageWithBasePath";

// Task and Column interfaces
interface Task {
  id: string;
  content: string;
  priority: "Low" | "Medium" | "High" | string;
}

interface Column {
  title: string;
  tasks: Task[];
}

type Columns = Record<string, Column>;

const initialColumns: Columns = {
  column1: {
    title: "New",
    tasks: [
      { id: "task1", content: "Task 1", priority: "Low" },
      { id: "task2", content: "Task 2", priority: "Medium" },
    ],
  },
  column2: {
    title: "Inprogress",
    tasks: [
      { id: "task3", content: "Task 3", priority: "High" },
      { id: "task4", content: "Task 4", priority: "Medium" },
      { id: "task5", content: "Task 5", priority: "High" },
    ],
  },
  column3: {
    title: "On-hold",
    tasks: [
      { id: "task6", content: "Task 5", priority: "Low" },
      { id: "task7", content: "Task 6", priority: "Low" },
    ],
  },
  column4: {
    title: "Completed",
    tasks: [{ id: "task8", content: "Task 7", priority: "Medium" }],
  },
};
const initialColumns2: Columns = {
  column1: {
    title: "New",
    tasks: [
      { id: "task8", content: "Task 1", priority: "High" },
      { id: "task2", content: "Task 2", priority: "High" },
    ],
  },
  column2: {
    title: "Inprogress",
    tasks: [
      { id: "task9", content: "Task 3", priority: "High" },
      { id: "task10", content: "Task 4", priority: "High" },
    ],
  },
  column3: {
    title: "On-hold",
    tasks: [{ id: "task12", content: "Task 5", priority: "High" }],
  },
  column4: {
    title: "Completed",
    tasks: [{ id: "task13", content: "Task 6", priority: "Medium" }],
  },
};
const initialColumns3: Columns = {
  column1: {
    title: "New",
    tasks: [{ id: "task14", content: "Task 1", priority: "Medium" }],
  },
  column2: {
    title: "Inprogress",
    tasks: [
      { id: "task16", content: "Task 3", priority: "Medium" },
      { id: "task17", content: "Task 4", priority: "Medium" },
      { id: "task11", content: "Task 5", priority: "Medium" },
    ],
  },
  column3: {
    title: "On-hold",
    tasks: [{ id: "task18", content: "Task 5", priority: "Medium" }],
  },
  column4: {
    title: "Completed",
    tasks: [{ id: "task19", content: "Task 7", priority: "Medium" }],
  },
};
const initialColumns4: Columns = {
  column1: {
    title: "New",
    tasks: [
      { id: "task20", content: "Task 1", priority: "Low" },
      { id: "task21", content: "Task 2", priority: "Low" },
    ],
  },
  column2: {
    title: "Inprogress",
    tasks: [
      { id: "task22", content: "Task 3", priority: "Low" },
      { id: "task23", content: "Task 4", priority: "Low" },
    ],
  },
  column3: {
    title: "On-hold",
    tasks: [{ id: "task25", content: "Task 5", priority: "Low" }],
  },
  column4: {
    title: "Completed",
    tasks: [{ id: "task28", content: "Task 7", priority: "Medium" }],
  },
};
const KanbanView = () => {
  const [columns, setColumns] = useState<Columns>(initialColumns);
  const [columns2] = useState<Columns>(initialColumns2);
  const [columns3] = useState<Columns>(initialColumns3);
  const [columns4] = useState<Columns>(initialColumns4);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];

    const sourceTasks = [...sourceColumn.tasks];
    const destinationTasks = [...destinationColumn.tasks];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destinationTasks.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: { ...destinationColumn, tasks: destinationTasks },
    });
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex my-xl-auto right-content justify-content-end align-items-center flex-wrap table-header">
            <div className="me-2 mb-3">
              <div className="dropdown">
                <Link
                  to="#"
                  className="dropdown-toggle btn btn-outline-white d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-file-export me-1" />
                  Export
                </Link>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item rounded-1"
                    >
                      <i className="ti ti-file-type-pdf me-1" />
                      Export as PDF
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item rounded-1"
                    >
                      <i className="ti ti-file-type-xls me-1" />
                      Export as Excel{" "}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default KanbanView;
