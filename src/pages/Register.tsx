import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonToast
} from "@ionic/react";

import {
  useContext,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  AuthContext
} from "../contexts/AuthContext";

import "./Auth.css";


function Register() {

  const authContext =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  const [mostrarToast, setMostrarToast] =
    useState(false);


  if (!authContext) {
    return null;
  }


  const { register } =
    authContext;


  const registrarUsuario =
    async () => {

      if (
        email.trim() === "" ||
        password.trim() === ""
      ) {

        setMensaje(
          "Completa todos los campos."
        );

        setMostrarToast(true);

        return;
      }


      if (
        password !== confirmPassword
      ) {

        setMensaje(
          "Las contraseñas no coinciden."
        );

        setMostrarToast(true);

        return;
      }


      try {

        await register(
          email,
          password
        );

        navigate("/tasks");

      } catch (error) {

        console.error(error);

        setMensaje(
          "No fue posible crear la cuenta."
        );

        setMostrarToast(true);

      }

    };


  return (

    <IonPage>

      <IonContent className="auth-page">

        <div className="auth-container">

          <div className="auth-card">

            <div className="auth-logo">
              +
            </div>


            <h1 className="auth-title">
              Crear cuenta
            </h1>

            <p className="auth-subtitle">
              Regístrate para empezar a organizar tus tareas
            </p>


            <IonItem
              lines="none"
              className="auth-input"
            >

              <IonInput
                label="Correo electrónico"
                labelPlacement="stacked"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onIonInput={(e) =>
                  setEmail(
                    e.detail.value ?? ""
                  )
                }
              />

            </IonItem>


            <IonItem
              lines="none"
              className="auth-input"
            >

              <IonInput
                label="Contraseña"
                labelPlacement="stacked"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onIonInput={(e) =>
                  setPassword(
                    e.detail.value ?? ""
                  )
                }
              />

            </IonItem>


            <IonItem
              lines="none"
              className="auth-input"
            >

              <IonInput
                label="Confirmar contraseña"
                labelPlacement="stacked"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onIonInput={(e) =>
                  setConfirmPassword(
                    e.detail.value ?? ""
                  )
                }
              />

            </IonItem>


            <IonButton
              expand="block"
              className="auth-button"
              onClick={registrarUsuario}
            >

              Crear cuenta

            </IonButton>


            <IonButton
              expand="block"
              fill="clear"
              className="auth-secondary"
              onClick={() =>
                navigate("/login")
              }
            >

              Ya tengo una cuenta

            </IonButton>


            <div className="auth-footer">
              Challenge 05 · Ionic + Firebase
            </div>

          </div>

        </div>


        <IonToast
          isOpen={mostrarToast}
          message={mensaje}
          duration={2500}
          onDidDismiss={() =>
            setMostrarToast(false)
          }
        />

      </IonContent>

    </IonPage>

  );
}


export default Register;