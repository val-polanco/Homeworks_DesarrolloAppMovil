import { useEffect, useRef, useState } from "react";

import {
  Camera,
  CameraResultType,
  CameraSource,
} from "@capacitor/camera";


import { Geolocation } from "@capacitor/geolocation";
import { Haptics } from "@capacitor/haptics";
import { Motion } from "@capacitor/motion";
import { LocalNotifications } from "@capacitor/local-notifications";

import type { PluginListenerHandle } from "@capacitor/core";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonProgressBar,
  IonBadge,
  IonText,
  IonList,
  IonIcon,
  IonImg,
} from "@ionic/react";

import {
  cameraOutline,
  walkOutline,
  timerOutline,
  trophyOutline,
} from "ionicons/icons";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase/config";


type Mission = {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
};


type Coordinates = {
  latitude: number;
  longitude: number;
};


// ==========================================
// PARA PRUEBA RÁPIDA
// CAMBIA 5 POR 50 ANTES DE LA ENTREGA FINAL
// ==========================================
const REQUIRED_DISTANCE = 50;


const initialMissions: Mission[] = [
  {
    id: 1,
    title: "Misión 1: Captura una foto",
    description:
      "Toma una foto para completar esta misión.",
    points: 50,
    completed: false,
  },
  {
    id: 2,
    title: "Misión 2: Explora tu entorno",
    description:
      `Desplázate al menos ${REQUIRED_DISTANCE} metros desde tu ubicación inicial.`,
    points: 75,
    completed: false,
  },
  {
    id: 3,
    title: "Misión 3: Quédate quieto",
    description:
      "Permanece quieto durante 10 segundos y recibe una vibración.",
    points: 100,
    completed: false,
  },
];


const Missions: React.FC = () => {

  const [missions, setMissions] =
    useState<Mission[]>(initialMissions);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [photoUrl, setPhotoUrl] =
    useState<string | null>(null);


  // ============================
  // MISIÓN 2 - GPS
  // ============================

  const [distance, setDistance] =
    useState(0);

  const [trackingLocation, setTrackingLocation] =
    useState(false);

  const [currentLatitude, setCurrentLatitude] =
    useState<number | null>(null);

  const [currentLongitude, setCurrentLongitude] =
    useState<number | null>(null);

  const [gpsAccuracy, setGpsAccuracy] =
    useState<number | null>(null);


  // ============================
  // MISIÓN 3
  // ============================

  const [quietSeconds, setQuietSeconds] =
    useState(0);

  const [checkingStillness, setCheckingStillness] =
    useState(false);

  const [motionStatus, setMotionStatus] =
    useState("Esperando...");


  // ============================
  // REFERENCIAS
  // ============================

  const missionsRef =
    useRef<Mission[]>(initialMissions);

  const startCoordinatesRef =
    useRef<Coordinates | null>(null);

  const locationWatchIdRef =
    useRef<string | null>(null);

  const motionListenerRef =
    useRef<PluginListenerHandle | null>(null);

  const quietStartRef =
    useRef<number>(0);

  const quietCompletedRef =
    useRef(false);

  const wakeLockRef =
    useRef<any>(null);


  useEffect(() => {
    missionsRef.current = missions;
  }, [missions]);


  const completed =
    missions.filter(
      (mission) => mission.completed
    ).length;


  const points =
    missions.reduce(
      (total, mission) =>
        total +
        (
          mission.completed
            ? mission.points
            : 0
        ),
      0
    );

    const ranking = [
      { name: "Laura", points: 225 },
      { name: "Carlos", points: 175 },
      {
      name: auth.currentUser?.email ?? "Tu usuario",
      points,
      } ,
      { name: "Andrés", points: 125 },
      { name: "Sofía", points: 75 },
    ].sort((a, b) => b.points - a.points);


  // ============================
  // GUARDAR PROGRESO
  // ============================

  const saveProgress =
    async (updated: Mission[]) => {

      const user =
        auth.currentUser;

      const localKey =
        `mission-progress-${user?.uid ?? "guest"}`;


      localStorage.setItem(
        localKey,
        JSON.stringify(updated)
      );


      if (user) {

        try {

          await setDoc(
            doc(
              db,
              "missionProgress",
              user.uid
            ),
            {
              points:
                updated.reduce(
                  (total, mission) =>
                    total +
                    (
                      mission.completed
                        ? mission.points
                        : 0
                    ),
                  0
                ),

              completedMissions:
                updated.filter(
                  (mission) =>
                    mission.completed
                ).length,

              missions:
                updated.map(
                  ({ id, completed }) => ({
                    id,
                    completed,
                  })
                ),

              updatedAt:
                new Date().toISOString(),
            },
            {
              merge: true,
            }
          );

        } catch (error) {

          console.error(
            "Error sincronizando Firebase:",
            error
          );

          setMessage(
            "Guardado localmente, pero no se pudo sincronizar con Firebase."
          );

        }

      }

    };


  // ============================
  // COMPLETAR MISIÓN
  // ============================

  const showLocalNotification = async (
  title: string,
  body: string,
  id: number
) => {
  try {
    let permission =
      await LocalNotifications.checkPermissions();

    if (permission.display !== "granted") {
      permission =
        await LocalNotifications.requestPermissions();
    }

    if (permission.display !== "granted") {
      return;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id,
          title,
          body,
        },
      ],
    });
  } catch (error) {
    console.error(
      "Error mostrando notificación:",
      error
    );
  }
};
  
  
  const completeMission =
    async (id: number) => {

      const current =
        missionsRef.current;


      if (
        current.find(
          (mission) =>
            mission.id === id
        )?.completed
      ) {
        return;
      }


      const updated =
        current.map(
          (mission) =>
            mission.id === id
              ? {
                  ...mission,
                  completed: true,
                }
              : mission
        );


      missionsRef.current =
        updated;

      setMissions(updated);

      await saveProgress(updated);

      await showLocalNotification(
        "Misión completada 🎉",
        "Has completado una misión",
        100 + id
      );

      const completedCount =
        updated.filter(
        (mission) => mission.completed
      ).length;

      if (
        completedCount ===
        updated.length - 1
      ) {
      await showLocalNotification(
        "¡Ya casi terminas!",
        "Te falta 1 misión para completar",
        200
      );
      }

    };


  // ============================
  // CARGAR PROGRESO
  // ============================

  useEffect(() => {

    const loadProgress =
      async () => {

        const user =
          auth.currentUser;

        const localKey =
          `mission-progress-${user?.uid ?? "guest"}`;


        try {

          const saved =
            localStorage.getItem(localKey);

          let loadedMissions =
            initialMissions;


          if (saved) {

            const parsed =
              JSON.parse(saved) as Mission[];


            loadedMissions =
              initialMissions.map(
                (mission) => {

                  const old =
                    parsed.find(
                      (item) =>
                        item.id === mission.id
                    );


                  return old
                    ? {
                        ...mission,
                        completed:
                          Boolean(old.completed),
                      }
                    : mission;

                }
              );

          }


          if (user) {

            const snapshot =
              await getDoc(
                doc(
                  db,
                  "missionProgress",
                  user.uid
                )
              );


            if (snapshot.exists()) {

              const data =
                snapshot.data();


              if (
                Array.isArray(data.missions)
              ) {

                loadedMissions =
                  initialMissions.map(
                    (mission) => {

                      const old =
                        data.missions.find(
                          (item: Mission) =>
                            item.id === mission.id
                        );


                      return old
                        ? {
                            ...mission,
                            completed:
                              Boolean(old.completed),
                          }
                        : mission;

                    }
                  );

              }

            }

          }


          missionsRef.current =
            loadedMissions;

          setMissions(
            loadedMissions
          );


          const savedPhoto =
            localStorage.getItem(
              `mission-photo-${user?.uid ?? "guest"}`
            );


          if (savedPhoto) {

            setPhotoUrl(
              savedPhoto
            );

          }

        } catch (error) {

          console.error(
            "Error cargando progreso:",
            error
          );

          setMessage(
            "No se pudo cargar el progreso guardado."
          );

        } finally {

          setLoading(false);

        }

      };


    void loadProgress();

  }, []);


  // ============================
  // MISIÓN 1 - CÁMARA
  // ============================

  const takeMissionPhoto =
    async () => {

      try {

        const photo =
          await Camera.getPhoto({
            quality: 80,
            allowEditing: false,
            resultType:
              CameraResultType.Uri,
            source:
              CameraSource.Prompt,
          });


        if (!photo.webPath) {

          setMessage(
            "No se pudo obtener la foto."
          );

          return;

        }


        setPhotoUrl(
          photo.webPath
        );


        localStorage.setItem(
          `mission-photo-${auth.currentUser?.uid ?? "guest"}`,
          photo.webPath
        );


        await completeMission(1);


        setMessage(
          "📷 ¡Foto capturada! Misión 1 completada."
        );

      } catch (error) {

        console.error(
          "Error tomando la foto:",
          error
        );

        setMessage(
          "Se canceló o no se pudo tomar la foto."
        );

      }

    };


  // ============================
  // CALCULAR DISTANCIA GPS
  // ============================

  const calculateDistance =
    (
      first: Coordinates,
      second: Coordinates
    ) => {

      const earthRadius =
        6371000;


      const toRadians =
        (degrees: number) =>
          degrees *
          Math.PI /
          180;


      const latitude1 =
        toRadians(
          first.latitude
        );

      const latitude2 =
        toRadians(
          second.latitude
        );


      const latitudeDifference =
        toRadians(
          second.latitude -
          first.latitude
        );


      const longitudeDifference =
        toRadians(
          second.longitude -
          first.longitude
        );


      const a =
        Math.sin(
          latitudeDifference / 2
        ) ** 2 +
        Math.cos(latitude1) *
        Math.cos(latitude2) *
        Math.sin(
          longitudeDifference / 2
        ) ** 2;


      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );


      return earthRadius * c;

    };


  // ============================
  // DETENER GPS
  // ============================

  const stopLocationTracking =
    async () => {

      if (
        locationWatchIdRef.current
      ) {

        try {

          await Geolocation.clearWatch({
            id:
              locationWatchIdRef.current,
          });

        } catch (error) {

          console.error(
            "Error deteniendo GPS:",
            error
          );

        }

      }


      locationWatchIdRef.current =
        null;

      setTrackingLocation(false);

    };


  // ============================
  // MISIÓN 2 - GPS REAL
  // ============================

 const startLocationMission = async () => {

  try {

    setMessage("📡 Iniciando GPS...");

    let permissions =
      await Geolocation.checkPermissions();


    if (
      permissions.location !== "granted"
    ) {

      setMessage(
        "📍 Solicitando permiso de ubicación..."
      );

      permissions =
        await Geolocation.requestPermissions();

    }


    if (
      permissions.location !== "granted" &&
      permissions.coarseLocation !== "granted"
    ) {

      setMessage(
        "❌ Permiso de ubicación rechazado."
      );

      return;

    }


    setMessage(
      "🛰️ Buscando tu ubicación actual..."
    );


    const initialPosition =
      await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      });


    startCoordinatesRef.current = {

      latitude:
        initialPosition.coords.latitude,

      longitude:
        initialPosition.coords.longitude,

    };


    setCurrentLatitude(
      initialPosition.coords.latitude
    );

    setCurrentLongitude(
      initialPosition.coords.longitude
    );

    setGpsAccuracy(
      initialPosition.coords.accuracy
    );

    setDistance(0);

    setTrackingLocation(true);


    setMessage(
      `✅ GPS funcionando. Camina ${REQUIRED_DISTANCE} metros.`
    );


    const watchId =
      await Geolocation.watchPosition(

        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
        },

        async (
          position,
          error
        ) => {

          if (error) {

            console.error(
              "Error GPS:",
              error
            );

            setMessage(
              "❌ Error recibiendo datos del GPS."
            );

            return;

          }


          if (
            !position ||
            !startCoordinatesRef.current
          ) {

            return;

          }


          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;


          setCurrentLatitude(
            latitude
          );

          setCurrentLongitude(
            longitude
          );

          setGpsAccuracy(
            position.coords.accuracy
          );


          const current: Coordinates = {
            latitude,
            longitude,
          };


          const meters =
            calculateDistance(
              startCoordinatesRef.current,
              current
            );


          setDistance(
            meters
          );


          setMessage(
            `📡 GPS activo — ${meters.toFixed(1)} m recorridos`
          );


          if (
            meters >= REQUIRED_DISTANCE &&
            !missionsRef.current[1].completed
          ) {

            await stopLocationTracking();

            await completeMission(2);


            setMessage(
              `🎉 ¡Recorriste ${meters.toFixed(1)} m! Misión 2 completada.`
            );

          }

        }

      );


    locationWatchIdRef.current =
      watchId;

  } catch (error) {

    console.error(
      "ERROR GPS:",
      error
    );


    setTrackingLocation(false);


    setMessage(
      `❌ No se pudo iniciar GPS: ${
        error instanceof Error
          ? error.message
          : "Error desconocido"
      }`
    );

  }

};

  // ============================
  // WAKE LOCK
  // ============================

  const requestWakeLock =
    async () => {

      try {

        const nav =
          navigator as any;


        if (
          nav.wakeLock?.request
        ) {

          wakeLockRef.current =
            await nav.wakeLock
              .request("screen");

        }

      } catch (error) {

        console.warn(
          "Wake Lock no disponible:",
          error
        );

      }

    };


  const releaseWakeLock =
    async () => {

      try {

        if (
          wakeLockRef.current
        ) {

          await wakeLockRef
            .current
            .release();

        }

      } catch (error) {

        console.error(
          "Error liberando Wake Lock:",
          error
        );

      }


      wakeLockRef.current =
        null;

    };


  // ============================
  // DETENER MISIÓN 3
  // ============================

  const stopStillnessMission =
    async () => {

      const listener =
        motionListenerRef.current;


      motionListenerRef.current =
        null;


      if (listener) {

        try {

          await listener.remove();

        } catch (error) {

          console.error(
            "Error deteniendo acelerómetro:",
            error
          );

        }

      }


      setCheckingStillness(
        false
      );

      await releaseWakeLock();

    };


  // ============================
  // MISIÓN 3
  // ============================

  const startStillnessMission =
    async () => {

      if (
        checkingStillness
      ) {
        return;
      }


      try {

        setQuietSeconds(0);

        setCheckingStillness(
          true
        );

        setMotionStatus(
          "🟢 Quédate quieto"
        );


        quietCompletedRef.current =
          false;

        quietStartRef.current =
          Date.now();


        setMessage(
          "⏱️ Quédate quieto durante 10 segundos..."
        );


        await requestWakeLock();


        motionListenerRef.current =
          await Motion.addListener(
            "accel",

            async (event) => {

              const acceleration =
                event.acceleration;


              const x =
                acceleration?.x ?? 0;

              const y =
                acceleration?.y ?? 0;

              const z =
                acceleration?.z ?? 0;


              const movement =
                Math.sqrt(
                  x * x +
                  y * y +
                  z * z
                );


              if (
                movement > 0.75
              ) {

                quietStartRef.current =
                  Date.now();

                setQuietSeconds(0);

                setMotionStatus(
                  "🔴 Movimiento detectado"
                );

                return;

              }


              setMotionStatus(
                "🟢 Teléfono quieto"
              );


              const elapsed =
                Math.floor(
                  (
                    Date.now() -
                    quietStartRef.current
                  ) /
                  1000
                );


              const seconds =
                Math.min(
                  elapsed,
                  10
                );


              setQuietSeconds(
                seconds
              );


              if (
                seconds >= 10 &&
                !quietCompletedRef.current
              ) {

                quietCompletedRef.current =
                  true;


                await stopStillnessMission();


                try {

                  await Haptics.vibrate({
                    duration: 1000,
                  });

                } catch (error) {

                  console.error(
                    "Error vibrando:",
                    error
                  );

                }


                await completeMission(
                  3
                );


                setMessage(
                  "🎉 ¡10 segundos quieto! El teléfono vibró y completaste la Misión 3."
                );

              }

            }
          );

      } catch (error) {

        console.error(
          "Error con acelerómetro:",
          error
        );


        setCheckingStillness(
          false
        );


        await releaseWakeLock();


        setMessage(
          "No se pudo iniciar el acelerómetro."
        );

      }

    };


  // ============================
  // REINICIAR
  // ============================

  const resetProgress =
    async () => {

      await stopLocationTracking();

      await stopStillnessMission();


      missionsRef.current =
        initialMissions;

      setMissions(
        initialMissions
      );

      setPhotoUrl(null);

      setDistance(0);

      setQuietSeconds(0);

      setCurrentLatitude(null);

      setCurrentLongitude(null);

      setGpsAccuracy(null);

      setMotionStatus(
        "Esperando..."
      );


      startCoordinatesRef.current =
        null;


      localStorage.removeItem(
        `mission-photo-${auth.currentUser?.uid ?? "guest"}`
      );


      await saveProgress(
        initialMissions
      );


      setMessage(
        "Progreso reiniciado."
      );

    };


  // ============================
  // LIMPIEZA
  // ============================

  useEffect(() => {

    return () => {

      if (
        locationWatchIdRef.current
      ) {

        void Geolocation
          .clearWatch({
            id:
              locationWatchIdRef.current,
          });

      }


      if (
        motionListenerRef.current
      ) {

        void motionListenerRef
          .current
          .remove();

      }


      if (
        wakeLockRef.current
      ) {

        void wakeLockRef
          .current
          .release();

      }

    };

  }, []);


  const icons = [
    cameraOutline,
    walkOutline,
    timerOutline,
  ];


  // ============================
  // BOTONES DE MISIONES
  // ============================

  const renderMissionAction =
    (
      mission: Mission,
      unlocked: boolean
    ) => {

      if (
        mission.completed
      ) {

        return (
          <IonBadge color="success">
            Completada
          </IonBadge>
        );

      }


      if (!unlocked) {

        return (
          <IonBadge color="medium">
            Bloqueada
          </IonBadge>
        );

      }


      if (
        mission.id === 1
      ) {

        return (
          <IonButton
            expand="block"
            onClick={() =>
              void takeMissionPhoto()
            }
          >
            Tomar foto
          </IonButton>
        );

      }


      if (
        mission.id === 2
      ) {

        return (
          <>
            <IonButton
              expand="block"
              disabled={
                trackingLocation
              }
              onClick={() =>
                void startLocationMission()
              }
            >
              {
                trackingLocation
                  ? "GPS activo..."
                  : "Iniciar recorrido GPS"
              }
            </IonButton>


            {
              trackingLocation && (

                <div
                  style={{
                    marginTop: "14px",
                    padding: "14px",
                    borderRadius: "12px",
                    background: "#f4f1ff",
                  }}
                >

                  <p>
                    📡 <strong>GPS activo</strong>
                  </p>


                  <p>
                    Distancia detectada:{" "}

                    <strong>
                      {
                        distance.toFixed(1)
                      } m
                    </strong>

                    {" / "}

                    {
                      REQUIRED_DISTANCE
                    } m
                  </p>


                  <IonProgressBar
                    value={
                      Math.min(
                        distance /
                        REQUIRED_DISTANCE,
                        1
                      )
                    }
                  />


                  <p>
                    Latitud:{" "}
                    {
                      currentLatitude !== null
                        ? currentLatitude.toFixed(6)
                        : "..."
                    }
                  </p>


                  <p>
                    Longitud:{" "}
                    {
                      currentLongitude !== null
                        ? currentLongitude.toFixed(6)
                        : "..."
                    }
                  </p>


                  <p>
                    Precisión GPS:{" "}

                    {
                      gpsAccuracy !== null
                        ? `${gpsAccuracy.toFixed(1)} m`
                        : "..."
                    }
                  </p>

                </div>

              )
            }

          </>
        );

      }


      if (
        mission.id === 3
      ) {

        return (
          <>
            <IonButton
              expand="block"
              disabled={
                checkingStillness
              }
              onClick={() =>
                void startStillnessMission()
              }
            >

              {
                checkingStillness
                  ? `Quieto ${quietSeconds}/10 s`
                  : "Iniciar prueba de 10 segundos"
              }

            </IonButton>


            {
              checkingStillness && (

                <div
                  style={{
                    marginTop: "14px",
                    padding: "14px",
                    borderRadius: "12px",
                    background: "#f4f1ff",
                  }}
                >

                  <p>
                    {
                      motionStatus
                    }
                  </p>


                  <h2>
                    {
                      quietSeconds
                    } / 10 segundos
                  </h2>


                  <IonProgressBar
                    value={
                      quietSeconds /
                      10
                    }
                  />

                </div>

              )
            }

          </>
        );

      }


      return null;

    };


  // ============================
  // INTERFAZ
  // ============================

  return (

    <IonPage>

      <IonHeader>

        <IonToolbar color="primary">

          <IonTitle>
            Misiones
          </IonTitle>

        </IonToolbar>

      </IonHeader>


      <IonContent className="ion-padding">


        <IonCard>

          <IonCardHeader>

            <IonCardTitle>

              <IonIcon
                icon={
                  trophyOutline
                }
              />

              {" "}
              Tu progreso

            </IonCardTitle>

          </IonCardHeader>


          <IonCardContent>

            <h1>
              {points} puntos
            </h1>

            <p>
              {completed} de{" "}
              {missions.length}{" "}
              misiones completadas
            </p>

            <IonProgressBar
              value={
                completed /
                missions.length
              }
            />

          </IonCardContent>

        </IonCard>


        {
          message && (

            <IonText color="primary">

              <p>
                {message}
              </p>

            </IonText>

          )
        }


        {
          loading && (

            <IonText>
              Cargando progreso...
            </IonText>

          )
        }


        <IonList>

          {
            missions.map(
              (
                mission,
                index
              ) => {

                const unlocked =
                  index === 0 ||
                  missions[
                    index - 1
                  ].completed;


                return (

                  <IonCard
                    key={
                      mission.id
                    }
                  >

                    <IonCardHeader>

                      <IonCardTitle>

                        <IonIcon
                          icon={
                            icons[index]
                          }
                        />

                        {" "}
                        {
                          mission.title
                        }

                      </IonCardTitle>

                    </IonCardHeader>


                    <IonCardContent>

                      <p>
                        {
                          mission.description
                        }
                      </p>

                      <p>
                        Puntos:{" "}

                        <strong>
                          {
                            mission.points
                          }
                        </strong>
                      </p>


                      {
                        renderMissionAction(
                          mission,
                          unlocked
                        )
                      }


                      {
                        mission.id === 1 &&
                        photoUrl && (

                          <IonImg
                            src={
                              photoUrl
                            }
                            alt="Foto de la misión"
                          />

                        )
                      }

                    </IonCardContent>

                  </IonCard>

                );

              }
            )
          }

        </IonList>


        <IonCard>

          <IonCardHeader>

            <IonCardTitle>
              Resultados
            </IonCardTitle>

          </IonCardHeader>


          <IonCardContent>

            <p>
              <strong>
                Puntos totales:
              </strong>{" "}
              {points}
            </p>


            <p>
              <strong>
                Misiones completadas:
              </strong>{" "}
              {completed} /{" "}
              {missions.length}
            </p>


            <p>
              <strong>
                Estado general:
              </strong>{" "}

              {
                completed ===
                missions.length
                  ? "Todas las misiones completadas"
                  : "Misiones pendientes"
              }
            </p>

          </IonCardContent>

        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              🏆 Ranking Top 5
            </IonCardTitle>
          </IonCardHeader>

        <IonCardContent>
          {ranking.map((player, index) => {
          const isCurrentUser =
            player.name ===
            (auth.currentUser?.email ?? "Tu usuario");

          return (
        <div
          key={player.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            fontWeight: isCurrentUser
              ? "bold"
              : "normal",
            color: isCurrentUser
              ? "#6a1b9a"
              : "inherit",
            borderBottom: "1px solid #eeeeee",
          }}
        >
          <span>
            {index + 1}. {player.name}
            {isCurrentUser && " (Tú)"}
          </span>

          <strong>
            {player.points} pts
          </strong>
        </div>
      );
    })}
  </IonCardContent>
    </IonCard>


        <IonButton
          expand="block"
          color="medium"
          fill="outline"
          onClick={() =>
            void resetProgress()
          }
        >
          Reiniciar progreso
        </IonButton>


      </IonContent>

    </IonPage>

  );

};


export default Missions;