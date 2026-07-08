import { useEffect, useRef } from "react";

const Cursor = () => {
  const dot = useRef(null),
    ring = useRef(null),
    pos = useRef({ x: 0, y: 0 }),
    lag = useRef({ x: 0, y: 0 }),
    raf = useRef(null);
  useEffect(() => {
    const mv = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = e.clientX + "px";
        dot.current.style.top = e.clientY + "px";
      }
    };
    const lp = () => {
      if (ring.current) {
        lag.current.x += (pos.current.x - lag.current.x) * 0.45;
        lag.current.y += (pos.current.y - lag.current.y) * 0.45;
        ring.current.style.left = lag.current.x + "px";
        ring.current.style.top = lag.current.y + "px";
      }
      raf.current = requestAnimationFrame(lp);
    };
    const ov = (e) => {
      if (e.target.closest("button,[data-h],.nav-pill,.sb,.pp"))
        document.body.classList.add("ch");
    };
    const ou = () => document.body.classList.remove("ch");
    document.addEventListener("mousemove", mv);
    document.addEventListener("mouseover", ov);
    document.addEventListener("mouseout", ou);
    raf.current = requestAnimationFrame(lp);
    return () => {
      document.removeEventListener("mousemove", mv);
      document.removeEventListener("mouseover", ov);
      document.removeEventListener("mouseout", ou);
      cancelAnimationFrame(raf.current);
    };
  }, []);
  return (
    <>
      <div id="cd" ref={dot} />
      <div id="cr" ref={ring} />
    </>
  );
};

export default Cursor;
