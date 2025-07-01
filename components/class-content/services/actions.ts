import { IClassContentResponse } from "../interfaces";
import { ClassContentInputs } from "../validators";
import { request } from "@/components";


export const createClassContent = ( data: ClassContentInputs ): Promise<IClassContentResponse> => request<IClassContentResponse>( "/class-content", "POST", data );

export const deleteClassContent = ( id: string ): Promise<void> => request<void>( `/class-content/${ id }`, "DELETE" );

export const getClassContentById = ( id: string ): Promise<IClassContentResponse> => request<IClassContentResponse>( `/class-content/${ id }`, "GET" );

export const getClassContents = (): Promise<IClassContentResponse[]> => request<IClassContentResponse[]>( "/class-content", "GET" );

export const getClassContentsByClassId = ( courseClassId: string ): Promise<IClassContentResponse[]> => request<IClassContentResponse[]>( `/class-content/by-class/${ courseClassId }`, "GET" );

export const updateClassContent = ( id: string, data: ClassContentInputs ): Promise<IClassContentResponse> => request<IClassContentResponse>( `/class-content/${ id }`, "PATCH", data );
