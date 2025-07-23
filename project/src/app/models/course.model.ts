// This defines a structure for a Course object
export interface Course {
  id: string;               // A unique ID for the course
  title: string;            // Name of the course
  description: string;      // Short explanation of what the course is about
  instructor: string;       // Name of the teacher for the course
  studentsCount: number;    // How many students are in the course
  progress: number;         // How much of the course is completed (in percent)
  color: string;            // A color to represent the course (for UI)
  assignments: number;      // Total number of assignments in the course
  nextClass?: Date;         // (Optional) Date and time of the next class
}

// This defines a structure for an Assignment object
export interface Assignment {
  id: string;                          // A unique ID for the assignment
  title: string;                       // Title or name of the assignment
  courseId: string;                    // ID of the course this assignment belongs to
  dueDate: Date;                       // The last date to submit the assignment
  status: 'pending' | 'submitted' | 'graded'; // The current state of the assignment
  grade?: number;                      // (Optional) Grade given for the assignment
}

// This defines a structure for a Student object
export interface Student {
  id: string;                          // A unique ID for the student
  name: string;                        // Full name of the student
  email: string;                       // Student's email address
  avatar: string;                      // A small profile picture (avatar) of the student
  role: 'student' | 'teacher' | 'administrator' | 'alumni'; // What type of user they are
  profileImage?: string;              // (Optional) A larger profile image
  department?: string;                // (Optional) Which department the student belongs to
  graduationYear?: number;            // (Optional) The year the student will or did graduate
  courses: string[];                  // A list of course IDs the student is enrolled in
  overallProgress: number;            // Total progress across all courses (in percent)
}
