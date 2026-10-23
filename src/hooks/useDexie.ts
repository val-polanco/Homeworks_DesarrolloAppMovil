import {
  useLiveQuery
} from "dexie-react-hooks";

import {
  dexieDb,
  Fruit
} from "../database/dexieDb";


export function useDexie() {

  const fruits =
    useLiveQuery(
      () =>
        dexieDb.fruits.toArray(),
      [],
      []
    );


  const add = async (
    data: Omit<Fruit, "id">
  ) => {

    await dexieDb.fruits.add(
      data
    );

  };


  const update = async (
    id: number,
    data: Partial<Fruit>
  ) => {

    await dexieDb.fruits.update(
      id,
      data
    );

  };


  const remove = async (
    id: number
  ) => {

    await dexieDb.fruits.delete(
      id
    );

  };


  return {
    fruits,
    add,
    update,
    remove
  };
}