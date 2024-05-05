import React from 'react'

const ExamTiming  = ({ deadline }) => {
  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;

  const parsedDeadline = React.useMemo(() => Date.parse(deadline), [deadline]);
  const [time, setTime] = React.useState(parsedDeadline - Date.now());

  React.useEffect(() => {
    const interval = setInterval(
      () => setTime(parsedDeadline - Date.now()),
      1000
    );

    return () => clearInterval(interval);
  }, [parsedDeadline]);
  const formatTime = (time) => `${Math.floor(time)}`.padStart(2, '0');

  const totalHours = Math.floor(time / HOUR);
  const remainingMinutes = Math.floor((time / MINUTE) % 60);
  const remainingSeconds = Math.floor((time / SECOND) % 60);
  return (
    <div className="text-red-600 font-bold text-xl">
       {formatTime(totalHours)}:{formatTime(remainingMinutes)}:{formatTime(remainingSeconds)}
    </div>
  );
}

export default ExamTiming;