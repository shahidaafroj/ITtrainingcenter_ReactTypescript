import { ICourse, IResponse } from '../../interfaces';
import {  ICourseDetails, ICourseDetailss, ICourseListItem, ICoursePostRequest } from '../../interfaces/ICourse';
import { BaseService } from '../services';

export class CourseService {
static getAll = async (): Promise<ICourse[]> => {
    try {
        console.log('[CourseService] Fetching all courses...');
        const response = await BaseService.createInstance().get('Course/GetCourses');
        
        // Add more detailed logging
        console.log('[CourseService] Full response:', response);
        console.log('[CourseService] Response data:', response.data);
        console.log('[CourseService] Response status:', response.status);
        
        if (!response.data || response.data.length === 0) {
            console.warn('[CourseService] Received empty data array');
        }
        
        return response.data || [];
    } catch (error: any) {
        console.error("[CourseService] Error fetching courses:", {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });
        throw error;
    }
}

static getAlls = async (): Promise<IResponse> => {
  try {
    const response = await BaseService.createInstance().get('Course/GetCourses');
    return {
      isSuccess: true,
      message: "Courses fetched",
      data: response.data,
      httpStatusCode: response.status?.toString() || "200"
    };
  } catch (error: any) {
    return {
      isSuccess: false,
      message: error.message || 'Failed to fetch courses',
      data: [],
      httpStatusCode: error.response?.status?.toString() || "500"
    };
  }
};



  static getById = async (id: number): Promise<ICourseDetails> => {
    try {
      const response = await BaseService.createInstance().get(`Course/GetCourse/${id}`);
      
      // Transform API response to ICourseDetails
      const apiData = response.data;
      return {
        courseId: apiData.courseId,
        courseName: apiData.courseName,
        shortCode: apiData.shortCode,
        totalHours: apiData.totalHours,
        courseFee: apiData.courseFee,
        isActive: apiData.isActive,
        remarks: apiData.remarks,
        createdDate: apiData.createdDate,
        instructors: apiData.Instructors?.map((instructor: { instructorId: any; employeeName: any; isPrimaryInstructor: any; assignmentDate: any; }) => ({
          instructorId: instructor.instructorId,
          employeeName: instructor.employeeName,
          isPrimaryInstructor: instructor.isPrimaryInstructor,
          assignmentDate: instructor.assignmentDate
        })) || [],
        classRooms: apiData.ClassRoom?.map((classroom: { classRoomId: any; roomName: any; isAvailable: any; }) => ({
          classRoomId: classroom.classRoomId,
          roomName: classroom.roomName,
          isAvailable: classroom.isAvailable
        })) || []
      };
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error('Failed to fetch course details');
    }
  };


  static getByIdd = async (id: number): Promise<IResponse<ICourseDetailss>> => {
  try {
    const response = await BaseService.createInstance().get(`Course/GetCourse/${id}`);
    return {
      isSuccess: true,
      message: 'Success',
      data: response.data,
      httpStatusCode: response.status.toString()
    };
  } catch (error: any) {
    return {
      isSuccess: false,
      message: error.message,
      data: null,
      httpStatusCode: error.response?.status?.toString() || '500'
    };
  }
};




// static getById = async (courseId: number): Promise<ICourse> => {
//         try {
//             const response = await BaseService.createInstance().get(`Course/GetCourse/${courseId}`);
//             return response.data;
//         } catch (error: any) {
//             console.error(`Error fetching course ${courseId}:`, error);
//             throw error;
//         }
//     }

static add = async (course: ICoursePostRequest): Promise<IResponse> => {
    try {
        console.log('[CourseService] Attempting to add course:', course);
        const response = await BaseService.createInstance().post('Course/InsertCourse', course);
        console.log('[CourseService] Add course response:', response);
        
        return {
            isSuccess: true,
            message: response.data?.message || "Course added successfully",
            data: response.data,
            httpStatusCode: response.status?.toString() || "201"
        };
    } catch (error: any) {
        console.error("[CourseService] Error adding course:", {
            error: error,
            response: error.response,
            message: error.message,
            requestData: course
        });
        
        return {
            isSuccess: false,
            message: error.response?.data?.message || 
                   error.response?.data?.title || // ASP.NET often puts errors in title
                   error.message || 
                   "Failed to add course",
            data: error.response?.data || null,
            httpStatusCode: error.response?.status?.toString() || "500"
        };
    }
}
    static update = async (course: ICoursePostRequest): Promise<IResponse> => {
        try {
            if (!course.courseId) {
                throw new Error("Course ID is required for update");
            }

            const response = await BaseService.createInstance().put(
                `Course/UpdateCourse/${course.courseId}`,
                course
            );

            return {
                isSuccess: true,
                message: response.data?.message || "Course updated successfully",
                data: response.data,
                httpStatusCode: response.status?.toString() || "200"
            };
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.response?.data?.message || 
                       error.message || 
                       "Failed to update course",
                data: null,
                httpStatusCode: error.response?.status?.toString() || "500"
            };
        }
    }

    static delete = async (courseId: number): Promise<IResponse> => {
        try {
            const response = await BaseService.createInstance().delete(`Course/DeleteCourse/${courseId}`);
            
            if (response.status === 204) {
                return {
                    isSuccess: true,
                    message: "Course deleted successfully",
                    data: null,
                    httpStatusCode: "204"
                };
            }

            return response.data || {
                isSuccess: false,
                message: "Unknown error occurred during deletion",
                data: null,
                httpStatusCode: response.status?.toString() || "500"
            };
        } catch (error: any) {
            return {
                isSuccess: false,
                message: error.response?.data?.message || 
                       error.message || 
                       "Failed to delete course",
                data: null,
                httpStatusCode: error.response?.status?.toString() || "500"
            };
        }
    }

    static getActiveCourses = async (): Promise<ICourse[]> => {
        try {
            const response = await BaseService.createInstance().get('Course/active');
            return response.data;
        } catch (error: any) {
            console.error("Error fetching active courses:", error);
            throw error;
        }
    }
}