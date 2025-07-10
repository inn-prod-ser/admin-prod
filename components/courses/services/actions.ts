import { CourseInputs, request } from "@/components";
import { ICoursesResponse } from "@/interfaces";


export const getCourses = (): Promise<ICoursesResponse[]> => request<ICoursesResponse[]>( "/courses/", "GET" );

export const createCourse = ( data: CourseInputs ): Promise<ICoursesResponse> => request<ICoursesResponse>( "/courses/", "POST", data );

export const deleteCourse = ( id: string ): Promise<void> => request<void>( `/courses/${ id }`, "DELETE" );

export const getCourseById = ( id: string ): Promise<ICoursesResponse> => request<ICoursesResponse>( `/courses/${ id }`, "GET" );

export const updateCourse = ( id: string, data: CourseInputs ): Promise<ICoursesResponse> => request<ICoursesResponse>( `/courses/${ id }`, "PATCH", data );
