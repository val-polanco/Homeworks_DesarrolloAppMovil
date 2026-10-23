import {
  IonButton,
  IonCheckbox,
  IonItem,
  IonLabel
} from "@ionic/react";

import {
  useNavigate
} from "react-router-dom";


interface Tarea {
  id: string;
  texto: string;
  completada: boolean;
}


interface Props {
  tarea: Tarea;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isConnected: boolean;
}


function TaskItem({
  tarea,
  onComplete,
  onDelete,
  isConnected
}: Props) {

  const navigate =
    useNavigate();


  return (

    <IonItem>

      <IonCheckbox
        slot="start"
        checked={tarea.completada}
        disabled={!isConnected}
        onIonChange={() =>
          onComplete(tarea.id)
        }
      />


      <IonLabel>

        <h2
          style={{
            textDecoration:
              tarea.completada
                ? "line-through"
                : "none"
          }}
        >

          {tarea.texto}

        </h2>

        <p>
          {
            tarea.completada
              ? "Completada"
              : "Pendiente"
          }
        </p>

      </IonLabel>


      <div className="task-actions">

        <IonButton
          size="small"
          fill="clear"
          onClick={() =>
            navigate(
              `/tasks/${tarea.id}`
            )
          }
        >
          Ver
        </IonButton>


        <IonButton
          size="small"
          fill="clear"
          disabled={!isConnected}
          onClick={() =>
            navigate(
              `/tasks/edit/${tarea.id}`
            )
          }
        >
          Editar
        </IonButton>


        <IonButton
          size="small"
          color="danger"
          fill="clear"
          disabled={!isConnected}
          onClick={() =>
            onDelete(tarea.id)
          }
        >
          Eliminar
        </IonButton>

      </div>

    </IonItem>

  );
}


export default TaskItem;