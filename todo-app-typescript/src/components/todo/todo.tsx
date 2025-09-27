import { FC, useRef } from "react";
import Form from "./form";
import TodoHero from "./todohero";
import TodoList from "./todolist";

const Todo: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="container todo-container">
      <TodoHero />
      <Form inputRef={inputRef} />
      <TodoList inputRef={inputRef} />
    </div>
  );
};

export default Todo;
