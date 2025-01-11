import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CourseState {
  courseData: {
    syllabus: Record<string, string>;
    chapters: Record<string, string>;
    questions: Record<string, string>;
  } | null;
  setCourseData: (data: any) => void;
  clearCourseData: () => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      courseData: null,
      setCourseData: (data) => set({ courseData: data }),
      clearCourseData: () => set({ courseData: null }),
    }),
    {
      name: 'course-storage',
    }
  )
); 