import { ICourseSection } from "../interfaces";
import { CreateSectionInputs, UpdateSectionInputs } from "../validators";
import { request } from "@/components";


export const getCourseSections = (): Promise<ICourseSection[]> => request<ICourseSection[]>( "/course-sections/", "GET" );

export const getCourseSectionById = ( id: string ): Promise<ICourseSection> => request<ICourseSection>( `/course-sections/${ id }`, "GET" );

export const getCourseSectionsByCourseId = ( courseId: string ): Promise<ICourseSection[]> => request<ICourseSection[]>( `/course-sections/course/${ courseId }`, "GET" );

export const createCourseSection = ( data: CreateSectionInputs ): Promise<ICourseSection> => request<ICourseSection>( "/course-sections/", "POST", data );

export const updateCourseSection = ( id: string, data: UpdateSectionInputs ): Promise<ICourseSection> => request<ICourseSection>( `/course-sections/${ id }`, "PATCH", data );

export const deleteCourseSection = ( id: string ): Promise<void> => request<void>( `/course-sections/${ id }`, "DELETE" );
