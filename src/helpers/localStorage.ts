const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") return localStorage?.getItem(key);
  return null;
};

const setLocalStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") localStorage.setItem(key, value);
  return null;
};

export { getLocalStorage, setLocalStorage };
