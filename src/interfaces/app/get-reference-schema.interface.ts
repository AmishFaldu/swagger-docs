import { DataTypesSuported } from "../swagger";

export interface IGetReferenceSchema {
  schemaType: DataTypesSuported;
  referenceSchema: string;
}
