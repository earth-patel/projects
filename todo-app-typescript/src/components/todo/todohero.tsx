import { FC } from "react";
import Card from "../UI/Card";

import { useAppSelector } from "../../store/utils";

const TodoHero: FC = () => {
  const { todo } = useAppSelector((state) => state.todoSlice);
  const completedTodos = todo.filter((item) => item.status === true);

  return (
    <Card className="todo-hero-container" backgroundColor="var(--color-dark)">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column">
          <span className="todo-hero-title fw-bold">Todo Done</span>
          <span className="todo-hero-subtitle">keep it up</span>
        </div>
        <div className="todo-hero-right fw-bold">
          <span>
            {completedTodos.length}/{todo.length}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TodoHero;
