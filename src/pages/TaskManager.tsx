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
  useNavigate
} from "react-router-dom";

import TaskList from "../components/TaskList";

import {
  AuthContext
} from "../contexts/AuthContext";

import {
  TasksContext
} from "../contexts/TaskContext";

import "./TaskManager.css";

import {
  useNetwork
} from "../hooks/useNetwork";


function TaskManager() {

  const authContext =
    useContext(AuthContext);

  const tasksContext =
    useContext(TasksContext);

  const navigate =
    useNavigate();

  const {
    isConnected
    } = useNetwork();


  if (
    !authContext ||
    !tasksContext
  ) {
    return null;
  }


  const {
    logout,
    user
  } = authContext;


  const {
    tareas,
    completarTarea,
    eliminarTarea
  } = tasksContext;


  const cerrarSesion =
    async () => {

      try {

        await logout();

        navigate(
          "/login",
          {
            replace: true
          }
        );

      } catch (error) {

        console.error(
          "Error al cerrar sesión:",
          error
        );

      }

    };


  const tareasPendientes =
    tareas.filter(
      (tarea) =>
        !tarea.completada
    ).length;


  const tareasCompletadas =
    tareas.filter(
      (tarea) =>
        tarea.completada
    ).length;


  return (

    <IonPage>

      <IonHeader>

        <IonToolbar className="task-toolbar">

          <IonTitle>
            Task Manager
          </IonTitle>


          <IonButton
            slot="end"
            fill="clear"
            className="task-logout-button"
            onClick={cerrarSesion}
          >

            Cerrar sesión

          </IonButton>

        </IonToolbar>

      </IonHeader>


      <IonContent className="task-page">

        <div className="task-container">


          <div className="task-welcome-card">

            <p className="task-welcome-small">
              Sesión iniciada
            </p>

            <h1 className="task-welcome-title">
              ¡Hola! 👋
            </h1>

            <p className="task-email">
              {user?.email}
            </p>

          </div>


          <div
            style={{
              padding: "12px 16px",
              marginBottom: "18px",
              borderRadius: "14px",
              background:
                isConnected
                  ? "#e8f5e9"
                  : "#fff3e0",
              color:
                isConnected
                  ? "#2e7d32"
                  : "#e65100",
              fontWeight: 600
            }}
          >
            {
              isConnected
              ? "● Conectado"
              : "● Sin conexión — las tareas online están bloqueadas"
            }
          </div>


          <h2 className="task-section-title">
            Tus tareas
          </h2>

          <p className="task-section-subtitle">
            Organiza y completa tus actividades pendientes.
          </p>


          <div className="task-stats">

            <div className="task-stat-card">

              <div className="task-stat-number">
                {tareasPendientes}
              </div>

              <div className="task-stat-label">
                Pendientes
              </div>

            </div>


            <div className="task-stat-card">

              <div className="task-stat-number">
                {tareasCompletadas}
              </div>

              <div className="task-stat-label">
                Completadas
              </div>

            </div>

          </div>


          <IonButton
            expand="block"
            className="task-new-button"
            disabled={!isConnected}
            onClick={() =>
              navigate("/tasks/new")
            }
          >

            + Nueva tarea

          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            onClick={() =>
            navigate("/contacts")
            }
          >
           Contactos en Firebase
          </IonButton>


          <IonButton
            expand="block"
            fill="outline"
            onClick={() =>
            navigate("/fruits")
            }
          >
            Frutas locales - Dexie
          </IonButton>

          <h3 className="task-list-title">
            Lista de tareas
          </h3>


          <div className="task-list-card">

            {
              tareas.length > 0

                ? (

                  <TaskList
                    tareas={tareas}
                    onComplete={completarTarea}
                    onDelete={eliminarTarea}
                    isConnected={isConnected}
                  />

                )

                : (

                  <div className="task-empty">

                    <div className="task-empty-icon">
                      ✓
                    </div>

                    No tienes tareas.

                  </div>

                )
            }

          </div>


        </div>

      </IonContent>

    </IonPage>

  );
}


export default TaskManager;