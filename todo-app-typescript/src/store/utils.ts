import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { todoItem } from "./todo"; // Import the todoItem type

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const saveTodosToLocalStorage = (todos: todoItem[]) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

export const loadTodosFromLocalStorage = (): todoItem[] => {
  const savedTodos = localStorage.getItem("todos");
  return savedTodos ? JSON.parse(savedTodos) : [];
};
