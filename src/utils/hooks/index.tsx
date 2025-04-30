import { useCallback, useState, useEffect } from "react";

export function useTypingAnimation(txt: string, timing: number = 50) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const start = useCallback(() => setAnimating(true), []);

  const pause = useCallback(() => setAnimating((prev) => !prev), []);

  const stop = useCallback(() => {
    setHasStarted(false);
    setAnimating(false);
    setText("");
    setI(0);
  }, []);

  const Button = useCallback(() => {
    return (
      <div>
        <button onClick={pause}>{animating ? "pause" : "start"}</button>
        {hasStarted && (
          <button onClick={stop}>{!animating ? "re-start" : "stop"}</button>
        )}
      </div>
    );
  }, [stop, pause, animating, hasStarted]);

  const Typo = useCallback(() => {
    return (
      <div className="relative">
        <p>{txt}</p>
        <p className="absolute">
          <span className="bg-theme text-white">{text}</span>
        </p>
      </div>
    );
  }, [text, txt]);

  useEffect(() => {
    if (animating) {
      setHasStarted(true);
      const id = setInterval(() => {
        setText((prev) => prev + txt.charAt(i));
        setI((prev) => prev + 1);
      }, timing);
      if (i === txt.length) {
        clearInterval(id);
      }
      return () => {
        clearInterval(id);
      };
    }
  }, [animating, txt, timing, i]);
  return {
    Button,
    Typo,
    animating,
    stop,
    start,
    pause,
  };
}
