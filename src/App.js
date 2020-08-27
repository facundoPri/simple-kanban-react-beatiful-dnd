import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

const columnsFromBackend = {
  [uuid()]: {
    name: "Backlog",
    items: [],
  },
  [uuid()]: {
    name: "Todo",
    items: [],
  },
  [uuid()]: {
    name: "In Progress",
    items: [],
  },
  [uuid()]: {
    name: "Done",
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [Columns, setColumns] = useState(columnsFromBackend);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, Columns, setColumns)}
      >
        {Object.entries(Columns).map(([id, column]) => {
          return (
            <div
              key={id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: 5,
                borderRadius: 10,
                backgroundColor: "#eee",
              }}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 500,
                          borderRadius: 10,
                          marginBottom: 8,
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 8,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263b4a"
                                        : "#456c86",
                                      color: "white",
                                      borderRadius: 10,
                                      border: 0,
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
                <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    placeholder="Add Task"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        console.log("add new task");
                        console.log(e.target.value);
                        console.log(id, column);
                        const newTask = { id: uuid(), content: e.target.value };
                        const newColumn = column;
                        newColumn.items.push(newTask);
                        setColumns({
                          ...Columns,
                          [id]: newColumn,
                        });
                        e.target.value = "";
                      }
                    }}
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      border: 0,
                      padding: 8,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
