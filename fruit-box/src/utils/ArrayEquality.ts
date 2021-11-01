const arrayEquals = <T>(arr1: T[], arr2: T[]) => {
  const isArray = Array.isArray(arr1) && Array.isArray(arr2);
  if (!isArray) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

export default arrayEquals;
