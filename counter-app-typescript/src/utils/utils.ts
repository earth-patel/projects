export const setLocalItems = (key: string, value: string | number) => {
  localStorage.setItem(key, value.toString());
};
