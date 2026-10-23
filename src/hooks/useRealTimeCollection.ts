import {
  onValue,
  push,
  ref,
  remove,
  update
} from "firebase/database";

import {
  realtimeDb
} from "../firebase/config";


export function useRealTimeCollection(
  collectionName: string
) {

  const listen = (
    callback: (data: any[]) => void
  ) => {

    const collectionRef =
      ref(
        realtimeDb,
        collectionName
      );


    const unsubscribe =
      onValue(
        collectionRef,
        (snapshot) => {

          const value =
            snapshot.val();


          if (!value) {

            callback([]);

            return;

          }


          const result =
            Object.entries(value).map(
              ([id, data]) => ({
                id,
                ...(data as object)
              })
            );


          callback(result);

        }
      );


    return unsubscribe;

  };


 const add = async (
  data: object
) => {

  const collectionRef =
    ref(
      realtimeDb,
      collectionName
    );

  const result =
    await push(
      collectionRef,
      data
    );

        return result.key;
    };


  const edit = async (
    id: string,
    data: object
  ) => {

    const itemRef =
      ref(
        realtimeDb,
        `${collectionName}/${id}`
      );


    await update(
      itemRef,
      data
    );

  };


  const removeItem = async (
    id: string
  ) => {

    const itemRef =
      ref(
        realtimeDb,
        `${collectionName}/${id}`
      );


    await remove(
      itemRef
    );

  };


  return {
    listen,
    add,
    edit,
    removeItem
  };
}