
import { useEffect, useState } from "react";
import {
  Camera,
  CameraResultType,
  CameraSource,
} from "@capacitor/camera";
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
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

type Mission = {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
};

const initialMissions: Mission[] = [
  {
    id: 1,
    title: "Misión 1: Captura una foto",
    description: "Toma una foto para completar esta misión.",
    points: 50,
    completed: false,
  },
  {
    id: 2,
    title: "Misión 2: Explora tu entorno",
    description: "Desplázate al menos 50 metros desde tu ubicación inicial.",
    points: 75,
    completed: false,
  },
  {
    id: 3,
    title: "Misión 3: Quédate quieto",
    description: "Permanece quieto durante 10 segundos y recibe una vibración.",
    points: 100,
    completed: false,
  },
];

const Missions: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const completed = missions.filter((m) => m.completed).length;

  const points = missions.reduce(
    (total, mission) =>
      total + (mission.completed ? mission.points : 0),
    0
  );

  useEffect(() => {
    const loadProgress = async () => {
      const user = auth.currentUser;
      const localKey = `mission-progress-${user?.uid ?? "guest"}`;

      try {
        const saved = localStorage.getItem(localKey);

        let loadedMissions = initialMissions;

        if (saved) {
          const parsed = JSON.parse(saved) as Mission[];

          loadedMissions = initialMissions.map((mission) => {
            const old = parsed.find((item) => item.id === mission.id);
            return old
              ? { ...mission, completed: Boolean(old.completed) }
              : mission;
          });
        }

        if (user) {
          const snapshot = await getDoc(
            doc(db, "missionProgress", user.uid)
          );

          if (snapshot.exists()) {
            const data = snapshot.data();

            if (Array.isArray(data.missions)) {
              loadedMissions = initialMissions.map((mission) => {
                const old = data.missions.find(
                  (item: Mission) => item.id === mission.id
                );

                return old
                  ? { ...mission, completed: Boolean(old.completed) }
                  : mission;
              });
            }
          }
        }

        setMissions(loadedMissions);

        const savedPhoto = localStorage.getItem(
          `mission-photo-${user?.uid ?? "guest"}`
        );

        if (savedPhoto) {
          setPhotoUrl(savedPhoto);
        }
      } catch (error) {
        console.error("Error cargando progreso:", error);
        setMessage("No se pudo cargar el progreso guardado.");
      } finally {
        setLoading(false);
      }
    };

    void loadProgress();
  }, []);

  const saveProgress = async (updated: Mission[]) => {
    const user = auth.currentUser;
    const localKey = `mission-progress-${user?.uid ?? "guest"}`;

    localStorage.setItem(localKey, JSON.stringify(updated));

    if (user) {
      try {
        await setDoc(
          doc(db, "missionProgress", user.uid),
          {
            points: updated.reduce(
              (total, mission) =>
                total + (mission.completed ? mission.points : 0),
              0
            ),
            completedMissions: updated.filter((m) => m.completed).length,
            missions: updated.map(({ id, completed }) => ({
              id,
              completed,
            })),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error sincronizando Firebase:", error);
        setMessage(
          "Guardado localmente, pero no se pudo sincronizar con Firebase."
        );
      }
    }
  };

  const completeMission = async (id: number) => {
    const updated = missions.map((mission) =>
      mission.id === id
        ? { ...mission, completed: true }
        : mission
    );

    setMissions(updated);
    await saveProgress(updated);
    setMessage("¡Misión completada! Tus puntos se actualizaron.");
  };

  const takeMissionPhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
      });

      if (!photo.webPath) {
        setMessage("No se pudo obtener la foto.");
        return;
      }

      setPhotoUrl(photo.webPath);

      // Guardar una referencia local de la imagen.
      localStorage.setItem(
        `mission-photo-${auth.currentUser?.uid ?? "guest"}`,
        photo.webPath
      );

      await completeMission(1);
      setMessage("¡Foto capturada! Misión completada.");
    } catch (error) {
      console.error("Error tomando la foto:", error);
      setMessage("Se canceló o no se pudo tomar la foto.");
    }
  };

  const resetProgress = async () => {
    setMissions(initialMissions);
    setPhotoUrl(null);

    localStorage.removeItem(
      `mission-photo-${auth.currentUser?.uid ?? "guest"}`
    );

    await saveProgress(initialMissions);
    setMessage("Progreso reiniciado.");
  };

  const icons = [cameraOutline, walkOutline, timerOutline];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Misiones</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={trophyOutline} /> Tu progreso
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <h1>{points} puntos</h1>
            <p>
              {completed} de {missions.length} misiones completadas
            </p>
            <IonProgressBar value={completed / missions.length} />
          </IonCardContent>
        </IonCard>

        {message && (
          <IonText color="primary">
            <p>{message}</p>
          </IonText>
        )}

        {loading && <IonText>Cargando progreso...</IonText>}


        <IonList>
          {missions.map((mission, index) => {
            const unlocked =
              index === 0 || missions[index - 1].completed;

            return (
              <IonCard key={mission.id}>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={icons[index]} /> {mission.title}
                  </IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <p>{mission.description}</p>
                  <p>
                    Puntos: <strong>{mission.points}</strong>
                  </p>

      {(() => {
          if (mission.completed) {
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

         return (
        <IonButton
          expand="block"
          onClick={() => {
          if (mission.id === 1) {
           void takeMissionPhoto();
          } else {
            void completeMission(mission.id);
        }
      }}
    >
      {mission.id === 1
        ? "Tomar foto"
        : "Completar misión"}
    </IonButton>
  );
        })()}

                  {mission.id === 1 && photoUrl && (
                    <IonImg
                      src={photoUrl}
                      alt="Foto de la misión"
                    />
                  )}
                </IonCardContent>
              </IonCard>
            );
          })}
        </IonList>

        <IonButton
          expand="block"
          color="medium"
          fill="outline"
          onClick={() => void resetProgress()}
        >
          Reiniciar progreso
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Missions;