"use server";

import { Todo, useTodoStore } from "@/app/lib/todoStore";

export async function addTodo(text: string) {
  useTodoStore.getState().addTodo(text);
}

export async function removeTodo(id: number) {
  useTodoStore.getState().removeTodo(id);
}

export async function editTodo(id: number, text: string) {
  useTodoStore.getState().editTodo(id, text);
}

export async function setTodos(
  list: { id: number; text: string; completed: boolean }[]
) {
  useTodoStore.setState({ todos: list as Todo[] });
}
