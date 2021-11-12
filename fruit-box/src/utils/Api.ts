export const apiBase = process.env.REACT_APP_ENDPOINT + "/v1";

export const fetcher = async (
  input: RequestInfo,
  init: RequestInit,
  ...args: any[]
) => {
  const res = await fetch(input, init);
  return res.json();
};
