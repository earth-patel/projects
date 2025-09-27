import { FC, FormEvent, RefObject } from "react";
import { FaPlus } from "react-icons/fa";
import { useAppDispatch } from "../../store/utils";
import { todoActions } from "../../store/todo";

const Form: FC<{ inputRef: RefObject<HTMLInputElement> }> = ({ inputRef }) => {
  const dispatch = useAppDispatch();

  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (inputRef.current?.value.trim()) {
      const updateID = inputRef.current.getAttribute("data-update");
      if (updateID) {
        dispatch(
          todoActions.updateTodo({
            id: Number(updateID),
            title: inputRef.current.value,
          })
        );
      } else {
        dispatch(todoActions.addTodo(inputRef.current.value));
      }
      inputRef.current.value = "";
      inputRef.current.removeAttribute("data-update");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="form-container d-flex gap-3 my-5"
    >
      <input
        className="w-100 p-2 px-3 border-0 text-white"
        type="text"
        ref={inputRef}
        placeholder="write your next task"
      />
      <button type="submit" className="p-4 border-0">
        <FaPlus />
      </button>
    </form>
  );
};

export default Form;
