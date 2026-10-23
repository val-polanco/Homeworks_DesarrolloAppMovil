import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar
} from "@ionic/react";

import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useDexie
} from "../hooks/useDexie";


function Fruits() {

  const navigate =
    useNavigate();


  const {
    fruits,
    add,
    update,
    remove
  } = useDexie();


  const [nombre, setNombre] =
    useState("");

  const [precio, setPrecio] =
    useState("");

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [mensaje, setMensaje] =
    useState("");

  const [mostrarToast, setMostrarToast] =
    useState(false);


  const guardarFruta =
    async () => {

      if (
        nombre.trim() === "" ||
        precio.trim() === ""
      ) {

        setMensaje(
          "Completa nombre y precio."
        );

        setMostrarToast(true);

        return;

      }


      const precioNumero =
        Number(precio);


      if (
        Number.isNaN(precioNumero) ||
        precioNumero <= 0
      ) {

        setMensaje(
          "Ingresa un precio válido."
        );

        setMostrarToast(true);

        return;

      }


      if (editandoId !== null) {

        await update(
          editandoId,
          {
            nombre,
            precio: precioNumero
          }
        );

        setMensaje(
          "Fruta actualizada."
        );

      } else {

        await add({
          nombre,
          precio: precioNumero
        });

        setMensaje(
          "Fruta agregada."
        );

      }


      setNombre("");
      setPrecio("");
      setEditandoId(null);
      setMostrarToast(true);

    };


  const editarFruta =
    (
      id: number,
      nombreFruta: string,
      precioFruta: number
    ) => {

      setNombre(nombreFruta);

      setPrecio(
        precioFruta.toString()
      );

      setEditandoId(id);

    };


  const eliminarFruta =
    async (
      id: number
    ) => {

      await remove(id);

      setMensaje(
        "Fruta eliminada."
      );

      setMostrarToast(true);

    };


  const cancelarEdicion =
    () => {

      setNombre("");
      setPrecio("");
      setEditandoId(null);

    };


  return (

    <IonPage>

      <IonHeader>

        <IonToolbar color="primary">

          <IonTitle>
            Fruits - Dexie
          </IonTitle>

        </IonToolbar>

      </IonHeader>


      <IonContent className="ion-padding">

        <IonButton
          fill="clear"
          onClick={() =>
            navigate("/tasks")
          }
        >
          ← Volver
        </IonButton>


        <h1>
          Frutas locales
        </h1>

        <p>
          Estos datos se guardan localmente usando Dexie e IndexedDB.
        </p>


        <IonItem>

          <IonInput
            label="Nombre"
            labelPlacement="stacked"
            placeholder="Ej: Manzana"
            value={nombre}
            onIonInput={(e) =>
              setNombre(
                e.detail.value ?? ""
              )
            }
          />

        </IonItem>


        <IonItem>

          <IonInput
            label="Precio"
            labelPlacement="stacked"
            type="number"
            placeholder="Ej: 3000"
            value={precio}
            onIonInput={(e) =>
              setPrecio(
                e.detail.value ?? ""
              )
            }
          />

        </IonItem>


        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={guardarFruta}
        >

          {
            editandoId !== null
              ? "Guardar cambios"
              : "Agregar fruta"
          }

        </IonButton>


        {
          editandoId !== null && (

            <IonButton
              expand="block"
              fill="clear"
              onClick={cancelarEdicion}
            >

              Cancelar edición

            </IonButton>

          )
        }


        <h2 className="ion-margin-top">
          Lista de frutas
        </h2>


        <IonList>

          {
            fruits?.map(
              (fruit) => (

                <IonItem
                  key={fruit.id}
                >

                  <IonLabel>

                    <h2>
                      {fruit.nombre}
                    </h2>

                    <p>
                      $
                      {
                        fruit.precio
                          .toLocaleString()
                      }
                    </p>

                  </IonLabel>


                  <IonButton
                    fill="clear"
                    onClick={() => {

                      if (
                        fruit.id !== undefined
                      ) {

                        editarFruta(
                          fruit.id,
                          fruit.nombre,
                          fruit.precio
                        );

                      }

                    }}
                  >

                    Editar

                  </IonButton>


                  <IonButton
                    fill="clear"
                    color="danger"
                    onClick={() => {

                      if (
                        fruit.id !== undefined
                      ) {

                        eliminarFruta(
                          fruit.id
                        );

                      }

                    }}
                  >

                    Eliminar

                  </IonButton>

                </IonItem>

              )
            )
          }

        </IonList>


        <IonToast
          isOpen={mostrarToast}
          message={mensaje}
          duration={2000}
          onDidDismiss={() =>
            setMostrarToast(false)
          }
        />

      </IonContent>

    </IonPage>

  );
}


export default Fruits;