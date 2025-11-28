import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Todo type definition
export interface Todo {
        id: number;
        text: string;
        completed?: boolean;
        createdAt?: number;
}

// Store state interface
interface TodoState {
        todos: Todo[];
        // List todos - todos array is already available, but we can add a getter
        getTodos: () => Todo[];
        // Add todo
        addTodo: (text: string) => void;
        // Remove todo
        removeTodo: (id: number) => void;
        // Edit todo
        editTodo: (id: number, text: string) => void;
        // Optional: Toggle completion
        toggleTodo: (id: number) => void;
        setTodos: (todos: Todo[]) => void;
}

// Create the Zustand store with persist middleware
export const useTodoStore = create<TodoState>()(
        persist(
                (set, get) => ({
                        // Initial state
                        todos: [],

                        // List todos - getter function
                        getTodos: () => get().todos,

                        // Add todo
                        addTodo: (text: string) =>
                                set((state) => ({
                                        todos: [
                                                ...state.todos,
                                                {
                                                        id: Date.now(),
                                                        text: text.trim(),
                                                        completed: false,
                                                        createdAt: Date.now(),
                                                },
                                        ],
                                })),

                        // Remove todo
                        removeTodo: (id: number) =>
                                set((state) => ({
                                        todos: state.todos.filter((todo) => todo.id !== id),
                                })),

                        // Edit todo
                        editTodo: (id: number, text: string) =>
                                set((state) => ({
                                        todos: state.todos.map((todo) =>
                                                todo.id === id ? { ...todo, text: text.trim() } : todo,
                                        ),
                                })),

                        // Optional: Toggle todo completion
                        toggleTodo: (id: number) =>
                                set((state) => ({
                                        todos: state.todos.map((todo) =>
                                                todo.id === id ? { ...todo, completed: !todo.completed } : todo,
                                        ),
                                })),

                        setTodos: (todos: Todo[]) => set({ todos }),
                }),
                {
                        name: 'todo-storage', // LocalStorage key
                        // Only access localStorage on the client side
                        storage: {
                                getItem: (name: string) => {
                                        if (typeof window !== 'undefined') {
                                                const value = localStorage.getItem(name);
                                                return value ? JSON.parse(value) : null;
                                        }
                                        return null;
                                },
                                setItem: (name: string, value: unknown) => {
                                        if (typeof window !== 'undefined') {
                                                localStorage.setItem(name, JSON.stringify(value));
                                        }
                                },
                                removeItem: (name: string) => {
                                        if (typeof window !== 'undefined') {
                                                localStorage.removeItem(name);
                                        }
                                },
                        },
                },
        ),
);
