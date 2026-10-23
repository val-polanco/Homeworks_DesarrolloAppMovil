import Dexie, {
  Table
} from "dexie";


export interface Fruit {
  id?: number;
  nombre: string;
  precio: number;
}


class ChallengeDatabase extends Dexie {

  fruits!: Table<Fruit, number>;


  constructor() {

    super("Challenge06DB");


    this.version(1).stores({

      fruits:
        "++id,nombre,precio"

    });

  }

}


export const dexieDb =
  new ChallengeDatabase();