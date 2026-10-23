import {
  createContext,
  ReactNode,
  useState
} from "react";


export interface Tarea {
  id: number;
  texto: string;
  completada: boolean;
}


interface TasksContextType {

  tareas: Tarea[];

  agregarTarea: (
    texto: string
  ) => void;

  completarTarea: (
    id: number
  ) => void;

  eliminarTarea: (
    id: number
  ) => void;

  editarTarea: (
    id: number,
    texto: string
  ) => void;

  obtenerTarea: (
    id: number
  ) => Tarea | undefined;
}


export const TasksContext =
  createContext<TasksContextType | undefined>(
    undefined
  );


interface Props {
  children: ReactNode;
}


export function TasksProvider({
  children
}: Props) {

  const [tareas, setTareas] =
    useState<Tarea[]>([
      {
        id: 1,
        texto: "Estudiar Ionic",
        completada: false
      },
      {
        id: 2,
        texto: "Terminar Challenge 05",
        completada: false
      }
    ]);


  const agregarTarea = (
    texto: string
  ) => {

    const nuevaTarea: Tarea = {

      id: Date.now(),

      texto,

      completada: false

    };


    setTareas([
      ...tareas,
      nuevaTarea
    ]);

  };


  const completarTarea = (
    id: number
  ) => {

    setTareas(

      tareas.map((tarea) =>

        tarea.id === id

          ? {
              ...tarea,
              completada:
                !tarea.completada
            }

          : tarea

      )

    );

  };


  const eliminarTarea = (
    id: number
  ) => {

    setTareas(

      tareas.filter(
        (tarea) =>
          tarea.id !== id
      )

    );

  };


  const editarTarea = (
    id: number,
    texto: string
  ) => {

    setTareas(

      tareas.map((tarea) =>

        tarea.id === id

          ? {
              ...tarea,
              texto
            }

          : tarea

      )

    );

  };


  const obtenerTarea = (
    id: number
  ) => {

    return tareas.find(
      (tarea) =>
        tarea.id === id
    );

  };


  return (

    <TasksContext.Provider
      value={{
        tareas,
        agregarTarea,
        completarTarea,
        eliminarTarea,
        editarTarea,
        obtenerTarea
      }}
    >

      {children}

    </TasksContext.Provider>

  );
}