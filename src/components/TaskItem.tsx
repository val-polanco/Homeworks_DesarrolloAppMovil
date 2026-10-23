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
  id: number;
  texto: string;
  completada: boolean;
}


interface Props {
  tarea: Tarea;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}


function TaskItem({
  tarea,
  onComplete,
  onDelete
}: Props) {

  const navigate =
    useNavigate();


  return (

    <IonItem>

      <IonCheckbox
        slot="start"
        checked={tarea.completada}
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