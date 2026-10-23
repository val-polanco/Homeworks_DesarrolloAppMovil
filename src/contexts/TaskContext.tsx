import {
  createContext,
  ReactNode,
  useEffect,
  useState
} from "react";

import {
  useRealTimeCollection
} from "../hooks/useRealTimeCollection";


export interface Tarea {
  id: string;
  texto: string;
  completada: boolean;
}


interface TasksContextType {

  tareas: Tarea[];

  agregarTarea: (
    texto: string
  ) => Promise<void>;

  completarTarea: (
    id: string
  ) => Promise<void>;

  eliminarTarea: (
    id: string
  ) => Promise<void>;

  editarTarea: (
    id: string,
    texto: string
  ) => Promise<void>;

  obtenerTarea: (
    id: string
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
    useState<Tarea[]>([]);


  const {
    listen,
    add,
    edit,
    removeItem
  } = useRealTimeCollection("tasks");


  useEffect(() => {

    const unsubscribe =
      listen((datos) => {

        setTareas(
          datos as Tarea[]
        );

      });


    return () => {
      unsubscribe();
    };

  }, []);


  const agregarTarea =
    async (
      texto: string
    ) => {

      await add({
        texto,
        completada: false
      });

    };


  const completarTarea =
    async (
      id: string
    ) => {

      const tarea =
        tareas.find(
          (item) =>
            item.id === id
        );


      if (!tarea) {
        return;
      }


      await edit(
        id,
        {
          completada:
            !tarea.completada
        }
      );

    };


  const eliminarTarea =
    async (
      id: string
    ) => {

      await removeItem(id);

    };


  const editarTarea =
    async (
      id: string,
      texto: string
    ) => {

      await edit(
        id,
        {
          texto
        }
      );

    };


  const obtenerTarea =
    (
      id: string
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