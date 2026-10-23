import {
  useEffect,
  useState
} from "react";

import {
  Network
} from "@capacitor/network";


export function useNetwork() {

  const [isConnected, setIsConnected] =
    useState(true);


  useEffect(() => {

    let active = true;

    let removeListener:
      (() => Promise<void>) | undefined;


    const iniciar =
      async () => {

        const status =
          await Network.getStatus();


        if (active) {

          setIsConnected(
            status.connected
          );

        }


        const listener =
          await Network.addListener(
            "networkStatusChange",
            (status) => {

              if (active) {

                setIsConnected(
                  status.connected
                );

              }

            }
          );


        removeListener =
          () => listener.remove();

      };


    iniciar();


    return () => {

      active = false;

      if (removeListener) {
        void removeListener();
      }

    };

  }, []);


  return {
    isConnected
  };
}