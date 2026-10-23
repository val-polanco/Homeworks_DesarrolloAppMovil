import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";

import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  TasksContext
} from "../contexts/TaskContext";


function AddEditTask() {

  const tasksContext =
    useContext(TasksContext);

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [texto, setTexto] =
    useState("");


  if (!tasksContext) {
    return null;
  }


  const {
    agregarTarea,
    editarTarea,
    obtenerTarea
  } = tasksContext;


  const editando =
    Boolean(id);


  useEffect(() => {

    if (id) {

      const tarea =
        obtenerTarea(id);

      if (tarea) {
        setTexto(tarea.texto);
      }

    }

  }, [id, obtenerTarea]);


  const guardar =
    async () => {

      if (texto.trim() === "") {
        return;
      }


      if (id) {

        await editarTarea(
          id,
          texto
        );

      } else {

        await agregarTarea(
          texto
        );

      }


      navigate("/tasks");

    };


  return (

    <IonPage>

      <IonHeader>

        <IonToolbar color="primary">

          <IonTitle>

            {
              editando
                ? "Editar tarea"
                : "Nueva tarea"
            }

          </IonTitle>

        </IonToolbar>

      </IonHeader>


      <IonContent className="ion-padding">

        <IonItem>

          <IonInput
            label="Nombre de la tarea"
            labelPlacement="stacked"
            placeholder="Escribe la tarea"
            value={texto}
            onIonInput={(e) =>
              setTexto(
                e.detail.value ?? ""
              )
            }
          />

        </IonItem>


        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={guardar}
        >

          {
            editando
              ? "Guardar cambios"
              : "Agregar tarea"
          }

        </IonButton>


        <IonButton
          expand="block"
          fill="clear"
          onClick={() =>
            navigate("/tasks")
          }
        >

          Cancelar

        </IonButton>

      </IonContent>

    </IonPage>

  );
}


export default AddEditTask;