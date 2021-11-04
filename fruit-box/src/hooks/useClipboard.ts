import copy from "copy-to-clipboard";

export const useClipboardHttp = () => {
  const execute = (text: string) => copy(text);

  return execute;
};
