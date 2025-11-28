"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { useTodoStore } from "../lib/todoStore";

export function RegisterTodoActions() {
  const { addTodo, removeTodo, editTodo, setTodos } = useTodoStore();

  useCopilotAction({
    name: "addTodo",
    description: "Add a new todo item",
    parameters: [
      {
        name: "text",
        type: "string",
        description: "The text of the todo item",
      },
    ],
    handler: async ({ text }) => {
      addTodo(text);
      return {
        success: true,
        message: "Todo added successfully",
      };
    },
  });

  useCopilotAction({
    name: "removeTodo",
    description: "Remove a todo item",
    parameters: [
      { name: "id", type: "number", description: "The id of the todo item" },
    ],
    handler: async ({ id }) => {
      removeTodo(id);
      return {
        success: true,
        message: "Todo removed successfully",
      };
    },
  });

  useCopilotAction({
    name: "editTodo",
    description: "Edit a todo item",
    parameters: [
      { name: "id", type: "number", description: "The id of the todo item" },
      {
        name: "text",
        type: "string",
        description: "The text of the todo item",
      },
    ],
    handler: async ({ id, text }) => {
      editTodo(id, text);
      return {
        success: true,
        message: "Todo edited successfully",
      };
    },
  });

  useCopilotAction({
    name: "setTodos",
    description: "Set the todos list",
    parameters: [
      { name: "todos", type: "object[]", description: "The todos list" },
    ],
    handler: async ({ todos }) => {
      setTodos(todos);
      return {
        success: true,
        message: "Todos set successfully",
      };
    },
  });

  return <></>;
}
