import { ClassInputs } from "../validators";
import { IClassCourseResponse, ICourseClassesResponse } from "../interfaces";
import { request } from "@/components";


export const getClassesBySecionId = ( sectionId: string ): Promise<ICourseClassesResponse[]> => request<ICourseClassesResponse[]>( `/course-classes/section/${ sectionId }`, "GET" );

export const createClass = ( data: ClassInputs ): Promise<IClassCourseResponse> => request<IClassCourseResponse>( "/course-classes/", "POST", data );

export const deleteClass = ( id: string ): Promise<void> => request( `/course-classes/${ id }`, "DELETE" );

export const getClassById = ( id: string ): Promise<IClassCourseResponse> => request<IClassCourseResponse>( `/course-classes/${ id }`, "GET" );

export const updateClass = ( id: string, data: ClassInputs ): Promise<IClassCourseResponse> => request<IClassCourseResponse>( `/course-classes/${ id }`, "PATCH", data );

export const updateClassOrder = ( id: string, positionOrder: number ): Promise<IClassCourseResponse> => request<IClassCourseResponse>( `/course-classes/order/${ id }`, "PATCH", { positionOrder } );
