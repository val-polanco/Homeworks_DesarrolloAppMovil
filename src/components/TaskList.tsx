import {
  IonList
} from "@ionic/react";

import TaskItem from "./TaskItem";


interface Tarea {
  id: string;
  texto: string;
  completada: boolean;
}


interface Props {
  tareas: Tarea[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isConnected: boolean;
}


function TaskList({
  tareas,
  onComplete,
  onDelete,
  isConnected
}: Props) {

  return (

    <IonList>

      {tareas.map((tarea) => (

        <TaskItem
          key={tarea.id}
          tarea={tarea}
          onComplete={onComplete}
          onDelete={onDelete}
          isConnected={isConnected}
        />

      ))}

    </IonList>

  );
}


export default TaskList;