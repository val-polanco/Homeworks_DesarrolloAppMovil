import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  QueryConstraint,
  query,
  updateDoc
} from "firebase/firestore";

import {
  db
} from "../firebase/config";


export function useCollection(
  collectionName: string
) {

  const getAll = async (
    constraints: QueryConstraint[] = []
  ) => {

    const collectionRef =
      collection(
        db,
        collectionName
      );


    const consulta =
      constraints.length > 0
        ? query(
            collectionRef,
            ...constraints
          )
        : collectionRef;


    const snapshot =
      await getDocs(consulta);


    return snapshot.docs.map(
      (documento) => ({
        id: documento.id,
        ...documento.data()
      })
    );

  };


  const add = async (
    data: DocumentData
  ) => {

    const collectionRef =
      collection(
        db,
        collectionName
      );


    const resultado =
      await addDoc(
        collectionRef,
        data
      );


    return resultado.id;

  };


  const update = async (
    id: string,
    data: DocumentData
  ) => {

    const documentRef =
      doc(
        db,
        collectionName,
        id
      );


    await updateDoc(
      documentRef,
      data
    );

  };


  const remove = async (
    id: string
  ) => {

    const documentRef =
      doc(
        db,
        collectionName,
        id
      );


    await deleteDoc(
      documentRef
    );

  };


  return {
    getAll,
    add,
    update,
    remove
  };
}