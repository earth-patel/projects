import { FC, RefObject } from "react";
import Card from "../UI/Card";

import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";

import { useAppDispatch } from "../../store/utils";
import { todoActions } from "../../store/todo";

type TodoItemProps = {
  item: {
    id: number;
    title: string;
    status: boolean;
  };
  inputRef: RefObject<HTMLInputElement>;
};

const TodoItem: FC<TodoItemProps> = ({ item, inputRef }) => {
  const dispatch = useAppDispatch();

  const onToggleHandler = () => {
    dispatch(todoActions.toggleState(item.id));
  };

  const onEditHandler = () => {
    if (inputRef?.current) {
      inputRef.current.value = item.title;
      inputRef.current.setAttribute("data-update", item.id.toString());
      inputRef.current.focus();
    }
  };

  const onDeleteHandler = () => {
    dispatch(todoActions.deleteTodo(item.id));
  };

  const isActive = item.status ? "active" : "";
  const isStriked = item.status ? "text-decoration-line-through" : "";

  return (
    <>
      <Card backgroundColor="var(--color-grey)">
        <div className="d-flex align-items-center justify-content-between px-4 py-2">
          <div className="todo-item-left d-flex align-items-center gap-3">
            <button
              onClick={onToggleHandler}
              className={`todo-item-toggle-button ${isActive}`}
            ></button>
            <div
              onClick={onToggleHandler}
              className={`todo-item-title fw-bold user-select-none ${isStriked}`}
            >
              {item.title}
            </div>
          </div>
          <div className="todo-item-right d-flex align-items-center gap-2">
            {!item.status && (
              <button onClick={onEditHandler}>
                <CiEdit />
              </button>
            )}
            <button onClick={onDeleteHandler}>
              <MdOutlineDelete />
            </button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default TodoItem;
