import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Course {
  id: string;
  title: string;
  data: any;
  agentId?: string;
}

interface CourseState {
  courses: Course[];
  currentCourseId: string | null;
  addCourse: (title: string, data: Course['data'], agentId?: string) => void;
  updateCourseAgent: (courseId: string, agentId: string) => void;
  setCurrentCourse: (courseId: string | null) => void;
  getCurrentCourse: () => Course | null;
  clearCurrentCourse: () => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],
      currentCourseId: null,
      addCourse: (title, data, agentId) => {
        const id = title.toLowerCase().replace(/\s+/g, '_');
        set((state) => ({
          courses: [...state.courses.filter(c => c.id !== id), { id, title, data, agentId }],
          currentCourseId: id,
        }));
      },
      updateCourseAgent: (courseId, agentId) => {
        set((state) => ({
          courses: state.courses.map(course => 
            course.id === courseId 
              ? { ...course, agentId } 
              : course
          ),
        }));
      },
      setCurrentCourse: (courseId) => set({ currentCourseId: courseId }),
      getCurrentCourse: () => {
        const state = get();
        return state.courses.find(c => c.id === state.currentCourseId) || null;
      },
      clearCurrentCourse: () => set({ currentCourseId: null }),
    }),
    {
      name: 'course-storage',
    }
  )
); 