import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar
} from "@ionic/react";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useCollection
} from "../hooks/useCollection";

import {
  useNetwork
} from "../hooks/useNetwork";


interface Contacto {
  id: string;
  nombre: string;
  telefono: string;
}


function Contacts() {

  const navigate =
    useNavigate();


  const {
    isConnected
  } = useNetwork();


  const {
    getAll,
    add,
    update,
    remove
  } = useCollection("contacts");


  const [contactos, setContactos] =
    useState<Contacto[]>([]);

  const [nombre, setNombre] =
    useState("");

  const [telefono, setTelefono] =
    useState("");

  const [editandoId, setEditandoId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [mensaje, setMensaje] =
    useState("");

  const [mostrarToast, setMostrarToast] =
    useState(false);


  const cargarContactos =
    async () => {

      try {

        setLoading(true);

        const datos =
          await getAll();


        setContactos(
          datos as Contacto[]
        );

      } catch (error) {

        console.error(error);

        setMensaje(
          "No fue posible cargar los contactos."
        );

        setMostrarToast(true);

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    if (isConnected) {
      cargarContactos();
    } else {
      setLoading(false);
    }

  }, [isConnected]);


  const guardarContacto =
    async () => {

      if (!isConnected) {

        setMensaje(
          "Necesitas conexión a Internet para guardar contactos."
        );

        setMostrarToast(true);

        return;

      }


      if (
        nombre.trim() === "" ||
        telefono.trim() === ""
      ) {

        setMensaje(
          "Completa nombre y teléfono."
        );

        setMostrarToast(true);

        return;

      }


      try {

        if (editandoId) {

          await update(
            editandoId,
            {
              nombre,
              telefono
            }
          );

          setMensaje(
            "Contacto actualizado."
          );

        } else {

          await add({
            nombre,
            telefono
          });

          setMensaje(
            "Contacto agregado."
          );

        }


        setNombre("");
        setTelefono("");
        setEditandoId(null);

        await cargarContactos();

        setMostrarToast(true);

      } catch (error) {

        console.error(error);

        setMensaje(
          "Ocurrió un error al guardar."
        );

        setMostrarToast(true);

      }

    };


  const editarContacto =
    (contacto: Contacto) => {

      if (!isConnected) {
        return;
      }


      setNombre(
        contacto.nombre
      );

      setTelefono(
        contacto.telefono
      );

      setEditandoId(
        contacto.id
      );

    };


  const eliminarContacto =
    async (
      id: string
    ) => {

      if (!isConnected) {

        setMensaje(
          "Necesitas conexión a Internet para eliminar contactos."
        );

        setMostrarToast(true);

        return;

      }


      try {

        await remove(id);

        await cargarContactos();

        setMensaje(
          "Contacto eliminado."
        );

        setMostrarToast(true);

      } catch (error) {

        console.error(error);

        setMensaje(
          "No fue posible eliminar el contacto."
        );

        setMostrarToast(true);

      }

    };


  const cancelarEdicion =
    () => {

      setNombre("");
      setTelefono("");
      setEditandoId(null);

    };


  return (

    <IonPage>

      <IonHeader>

        <IonToolbar color="primary">

          <IonTitle>
            Contactos
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
          ← Volver a tareas
        </IonButton>


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
              : "● Sin conexión — los contactos online están bloqueados"
          }

        </div>


        <h1>
          Contactos en Firebase
        </h1>

        <p>
          Los contactos se guardan en Cloud Firestore.
        </p>


        <IonItem>

          <IonInput
            label="Nombre"
            labelPlacement="stacked"
            placeholder="Nombre del contacto"
            value={nombre}
            disabled={!isConnected}
            onIonInput={(e) =>
              setNombre(
                e.detail.value ?? ""
              )
            }
          />

        </IonItem>


        <IonItem>

          <IonInput
            label="Teléfono"
            labelPlacement="stacked"
            type="tel"
            placeholder="Número de teléfono"
            value={telefono}
            disabled={!isConnected}
            onIonInput={(e) =>
              setTelefono(
                e.detail.value ?? ""
              )
            }
          />

        </IonItem>


        <IonButton
          expand="block"
          className="ion-margin-top"
          disabled={!isConnected}
          onClick={guardarContacto}
        >

          {
            editandoId
              ? "Guardar cambios"
              : "Agregar contacto"
          }

        </IonButton>


        {
          editandoId && (

            <IonButton
              expand="block"
              fill="clear"
              disabled={!isConnected}
              onClick={cancelarEdicion}
            >

              Cancelar edición

            </IonButton>

          )
        }


        <h2 className="ion-margin-top">
          Lista de contactos
        </h2>


        {
          loading

            ? (

              <div
                style={{
                  textAlign: "center",
                  padding: "30px"
                }}
              >

                <IonSpinner />

              </div>

            )

            : (

              <IonList>

                {
                  contactos.map(
                    (contacto) => (

                      <IonItem
                        key={
                          contacto.id
                        }
                      >

                        <IonLabel>

                          <h2>
                            {
                              contacto.nombre
                            }
                          </h2>

                          <p>
                            {
                              contacto.telefono
                            }
                          </p>

                        </IonLabel>


                        <IonButton
                          fill="clear"
                          disabled={!isConnected}
                          onClick={() =>
                            editarContacto(
                              contacto
                            )
                          }
                        >

                          Editar

                        </IonButton>


                        <IonButton
                          fill="clear"
                          color="danger"
                          disabled={!isConnected}
                          onClick={() =>
                            eliminarContacto(
                              contacto.id
                            )
                          }
                        >

                          Eliminar

                        </IonButton>

                      </IonItem>

                    )
                  )
                }

              </IonList>

            )
        }


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


export default Contacts;