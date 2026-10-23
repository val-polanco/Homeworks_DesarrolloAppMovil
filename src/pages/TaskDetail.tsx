import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";

import {
  useContext
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  TasksContext
} from "../contexts/TaskContext";


function TaskDetail() {

  const tasksContext =
    useContext(TasksContext);

  const navigate =
    useNavigate();

  const { id } =
    useParams();


  if (!tasksContext) {
    return null;
  }


  const {
    obtenerTarea
  } = tasksContext;


  const tarea =
    obtenerTarea(
      Number(id)
    );


  if (!tarea) {

    return (

      <IonPage>

        <IonContent className="ion-padding">

          <h2>
            Tarea no encontrada
          </h2>

          <IonButton
            onClick={() =>
              navigate("/tasks")
            }
          >

            Volver

          </IonButton>

        </IonContent>

      </IonPage>

    );

  }


  return (

    <IonPage>

      <IonHeader>

        <IonToolbar color="primary">

          <IonTitle>
            Detalle de tarea
          </IonTitle>

        </IonToolbar>

      </IonHeader>


      <IonContent className="ion-padding">

        <h1>
          {tarea.texto}
        </h1>

        <p>
          Estado:
          {" "}
          <strong>
            {
              tarea.completada
                ? "Completada"
                : "Pendiente"
            }
          </strong>
        </p>


        <IonButton
          expand="block"
          onClick={() =>
            navigate(
              `/tasks/edit/${tarea.id}`
            )
          }
        >

          Editar tarea

        </IonButton>


        <IonButton
          expand="block"
          fill="clear"
          onClick={() =>
            navigate("/tasks")
          }
        >

          Volver

        </IonButton>

      </IonContent>

    </IonPage>

  );
}


export default TaskDetail;