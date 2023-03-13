import { DataTypeA } from "../models/a"

export interface post {
  totlal: number;
  items: {
    title: string;
    /**
     * @minimum 0
     * @maxmum 150
     * @TJS-type integer
     */
    age: number;
    thing: DataTypeA;
  }[];
}
