import { metaProps } from "./meta";
import { PickerProps } from "./picker";
import { filterProps } from "./query";

export type findManyProps = ( filter: filterProps) => Promise<{ error: boolean; meta: metaProps; data: PickerProps[] }>;
export type findOneProps = (id: number) => Promise<{ error: boolean; data: PickerProps }>;
export type createProps = ( data: object ) => Promise<{ error: boolean; message: string; data: PickerProps }>;
export type updateProps = ( id: number, data: object ) => Promise<{ error: boolean; message: string; data: PickerProps }>;
export type deleteProps = (id: number) => Promise<{ error: boolean; message: string }>;
export type deleteMultipleProps=  ( ids: number[] ) => Promise<{ error: boolean; message: string }>;

export interface ResourceApis {
  findMany: findManyProps;
  findOne: findOneProps;
  create: createProps;
  update: updateProps;
  delete: deleteProps;
  deleteMultiple: deleteMultipleProps;
}