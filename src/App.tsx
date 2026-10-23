import {
  IonApp,
  IonRouterOutlet,
  IonSpinner,
  setupIonicReact
} from "@ionic/react";

import {
  IonReactRouter
} from "@ionic/react-router";

import {
  Navigate,
  Route
} from "react-router-dom";

import {
  useContext
} from "react";

import {
  AuthContext,
  AuthProvider
} from "./contexts/AuthContext";

import {
  TasksProvider
} from "./contexts/TaskContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskManager from "./pages/TaskManager";
import AddEditTask from "./pages/AddEditTask";
import TaskDetail from "./pages/TaskDetail";
import Contacts from "./pages/Contacts";
import Fruits from "./pages/Fruits";


import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

import "@ionic/react/css/padding.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "./theme/variables.css";


setupIonicReact();


function AppRoutes() {

  const authContext =
    useContext(AuthContext);


  if (!authContext) {
    return null;
  }


  const {
    user,
    loading
  } = authContext;


  if (loading) {

    return (

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >

        <IonSpinner />

      </div>

    );

  }


  return (

    <IonReactRouter>

      <IonRouterOutlet>


        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/tasks" replace />
              : <Login />
          }
        />


        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/tasks" replace />
              : <Register />
          }
        />


        <Route
          path="/tasks"
          element={
            user
              ? <TaskManager />
              : <Navigate to="/login" replace />
          }
        />


        <Route
          path="/contacts"
          element={
            user
              ? <Contacts />
              : <Navigate to="/login" replace />
          }
        />


        <Route
          path="/fruits"
          element={
            user
              ? <Fruits />
              : <Navigate to="/login" replace />
          }
        />


        <Route
          path="/tasks/new"
          element={
            user
              ? <AddEditTask />
              : <Navigate to="/login" replace />
          }
        />


        <Route
          path="/tasks/edit/:id"
          element={
            user
              ? <AddEditTask />
              : <Navigate to="/login" replace />
          }
        />


        <Route
          path="/tasks/:id"
          element={
            user
              ? <TaskDetail />
              : <Navigate to="/login" replace />
          }
        />


        <Route
          path="/"
          element={
            <Navigate
              to={
                user
                  ? "/tasks"
                  : "/login"
              }
              replace
            />
          }
        />


        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />


      </IonRouterOutlet>

    </IonReactRouter>

  );
}


const App: React.FC = () => (

  <IonApp>

    <AuthProvider>

      <TasksProvider>

        <AppRoutes />

      </TasksProvider>

    </AuthProvider>

  </IonApp>

);


export default App;