import { FC, useRef, useEffect } from "react";

import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";

import Card from "./UI/Card";
import { counterActions } from "../store/counter";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const Counter: FC = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { count } = useAppSelector((state) => state.counter);

  useEffect(() => {
    const defaultValue = localStorage.getItem("count");
    if (defaultValue)
      dispatch(counterActions.setDefaultValue(Number(defaultValue)));
  }, [dispatch]);

  const incrementHandler = () => {
    dispatch(counterActions.increment(Number(inputRef.current?.value)));
  };
  const decrementHandler = () => {
    dispatch(counterActions.decrement(Number(inputRef.current?.value)));
  };
  const resetHandler = () => {
    dispatch(counterActions.reset());
  };
  return (
    <Card className="counter-container">
      <div className="counter-count">{count}</div>
      <div className="counter-buttons">
        <button onClick={decrementHandler}>
          <AiOutlineMinus />
        </button>
        <button onClick={incrementHandler}>
          <AiOutlinePlus />
        </button>
        <button onClick={resetHandler}>
          <GrPowerReset />
        </button>
      </div>
      <div className="counter-amount">
        <input
          className="amount"
          ref={inputRef}
          min="0"
          type="number"
          placeholder="Enter Amount"
        />
      </div>
    </Card>
  );
};

export default Counter;
