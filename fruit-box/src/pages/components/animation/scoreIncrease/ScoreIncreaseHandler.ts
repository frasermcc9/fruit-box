import "./ScoreIncrease.css";

export const createScoreIncrease = (elId: string, score: number) => {
  const el = document.getElementById(elId);
  const num = document.createElement("div");
  num.innerHTML = `+${score}`;
  num.classList.add("plus-animation");

  el?.appendChild(num);

  setTimeout(function () {
    num.remove();
  }, 1900);
};
