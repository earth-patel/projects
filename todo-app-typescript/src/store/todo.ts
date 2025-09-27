import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { saveTodosToLocalStorage, loadTodosFromLocalStorage } from "./utils";

export type todoItem = {
  id: number;
  title: string;
  status: boolean;
};

export type todoState = { todo: todoItem[] };

const initialState: todoState = {
  todo: loadTodosFromLocalStorage(), // Load initial state from local storage
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      const newTodo = {
        id: Math.random(),
        title: action.payload,
        status: false,
      };
      state.todo.push(newTodo);
      saveTodosToLocalStorage(state.todo); // Save to local storage
    },
    deleteTodo(state, action: PayloadAction<number>) {
      state.todo = state.todo.filter((todo) => todo.id !== action.payload);
      saveTodosToLocalStorage(state.todo); // Save to local storage
    },
    updateTodo(state, action: PayloadAction<Partial<todoItem>>) {
      const existingTodo = state.todo.find(
        (todo) => todo.id === action.payload.id
      );
      if (existingTodo && action.payload.title) {
        existingTodo.title = action.payload.title;
        saveTodosToLocalStorage(state.todo); // Save to local storage
      }
    },
    toggleState(state, action: PayloadAction<number>) {
      const existingTodo = state.todo.find(
        (todo) => todo.id === action.payload
      );
      if (existingTodo) {
        existingTodo.status = !existingTodo?.status;
        saveTodosToLocalStorage(state.todo); // Save to local storage
      }
    },
  },
});

export const todoActions = todoSlice.actions;
export default todoSlice.reducer;
