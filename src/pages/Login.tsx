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


function Login() {

  const authContext =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  const [mostrarToast, setMostrarToast] =
    useState(false);


  if (!authContext) {
    return null;
  }


  const { login } =
    authContext;


  const iniciarSesion =
    async () => {

      try {

        await login(
          email,
          password
        );

        navigate("/tasks");

      } catch (error) {

        console.error(error);

        setMensaje(
          "Correo o contraseña incorrectos."
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
              ✓
            </div>


            <h1 className="auth-title">
              Bienvenida
            </h1>

            <p className="auth-subtitle">
              Inicia sesión para continuar con tus tareas
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
                placeholder="Tu contraseña"
                value={password}
                onIonInput={(e) =>
                  setPassword(
                    e.detail.value ?? ""
                  )
                }
              />

            </IonItem>


            <IonButton
              expand="block"
              className="auth-button"
              onClick={iniciarSesion}
            >

              Iniciar sesión

            </IonButton>


            <IonButton
              expand="block"
              fill="clear"
              className="auth-secondary"
              onClick={() =>
                navigate("/register")
              }
            >

              ¿No tienes cuenta? Crear cuenta

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


export default Login;