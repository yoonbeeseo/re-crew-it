import { PropsWithChildren, useEffect, useState } from "react";
import { ScreenContext } from "../screen.context";

export default function ScreenProvider({ children }: PropsWithChildren) {
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const getScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", getScroll);

    return () => {
      window.removeEventListener("scroll", getScroll);
    };
  }, []);
  return (
    <ScreenContext.Provider value={{ scroll }}>
      {children}
    </ScreenContext.Provider>
  );
}
