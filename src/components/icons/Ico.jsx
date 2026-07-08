import { PATHS } from "./iconPaths";

const Ico = ({ n, s = 18, c = "currentColor", sw = 1.7 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d={PATHS[n] || ""} />
  </svg>
);

export default Ico;
