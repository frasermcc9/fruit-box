import React, { useEffect } from "react";

interface Props {
  showCountdown: boolean;
}

const Countdown: React.FC<Props> = ({ showCountdown }) => {
  const [countdown, setCountdown] = React.useState(5);

  useEffect(() => {
    if (!showCountdown) return;

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [showCountdown]);

  return (
    <div className="font-semibold text-xl mb-4">
      {showCountdown ? (
        <div>{countdown}</div>
      ) : (
        <div>Waiting for the host to start...</div>
      )}
    </div>
  );
};

export default Countdown;
