import { FC, RefObject } from "react";
import TodoItem from "./todoitem";
import { useAppSelector } from "../../store/utils";

const TodoList: FC<{ inputRef: RefObject<HTMLInputElement> }> = ({
  inputRef,
}) => {
  const { todo } = useAppSelector((state) => state.todoSlice);
  return (
    <>
      {todo.map((item) => (
        <TodoItem inputRef={inputRef} key={item.id} item={item} />
      ))}
    </>
  );
};

export default TodoList;
