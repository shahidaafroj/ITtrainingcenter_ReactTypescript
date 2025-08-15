// import { ICourse } from './ICourse';

import { ICourse } from "./IClassRoom";

// export interface ICourseCombo {
//     courses: any;
//     courseComboId: number;
//     comboName: string;
//     selectedCourse: string; // This can be derived from selectedCourseIds
//     selectedCourseIds: number[];
//     courseId: number | null;

//     isActive: boolean;
//     remarks: string;
//     selectedCourseIdsError?: string;
// }


export interface ICourseCombo {
    courseComboId: number;
    comboName: string;
    selectedCourse: string;
    selectedCourseIds: number[];
    courseId: number | null;
    isActive: boolean;
    remarks: string;
    courses?: ICourse[]; // Make it optional since it's not always needed
    selectedCourseIdsError?: string;
}