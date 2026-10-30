import { useId } from "react";

const paths = {
  arrow: "M5 19 19 5M5 5h14v14",
  down: "M12 4v16m-7-7 7 7 7-7",
  plus: "M12 5v14M5 12h14",
  close: "m6 6 12 12M6 18 18 6",
  menu: "M4 8h16M4 16h16",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5",
  moon: "M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z",
  spark: "M12 2c0 7-3 10-10 10 7 0 10 3 10 10 0-7 3-10 10-10-7 0-10-3-10-10Z",
  browser:
    "M3 7h18M7 4v0m3 0v0M5 2h14a2 2 0 0 1 2 2v16H3V4a2 2 0 0 1 2-2ZM7 11l-2 3 2 3m10-6 2 3-2 3m-4-6-2 6",
  phone:
    "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 3h4m-3 14h2",
  shield: "m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6l9-4Zm-5 10 3 3 7-7",
  layers: "m12 2 10 5-10 5L2 7l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5",
  scan: "M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M6 12h12M9 8h6v8H9Z",
  cloud: "M7 18a5 5 0 1 1 1-10 6 6 0 0 1 11 3 3.5 3.5 0 0 1 0 7H7Z",
  pen: "m4 16-1 5 5-1L21 7l-4-4L4 16Zm10-10 4 4M4 16l4 4",
  chat: "M21 11a9 9 0 0 1-9 9H4l-3 2 2-7a9 9 0 1 1 18-4ZM7 11v2m3-5v8m4-10v10m3-7v5",
  globe:
    "M3 12h18M12 2c-6 5-6 15 0 20 6-5 6-15 0-20ZM12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Z",
  share:
    "m8 11 8-5m-8 7 8 5M5 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm14-8a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 16a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z",
  target: "M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5m-5 0 9-9m-5 0h5v5",
  play: "m9 6 9 6-9 6V6ZM12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Z",
  camera: "M8 5l2-3h4l2 3h5v15H3V5h5Zm4 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z",
  code: "m7 6-6 6 6 6m10-12 6 6-6 6m-3-15-4 18",
  rocket:
    "M14 3c3-1 7-1 7-1s0 4-1 7l-9 9-5-5 8-10ZM6 13l-4 1 2-6 7-2m0 12-1 4 6-2 2-7M5 18l-3 4 4-3",
  clock: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 4v6l4 2",
  check: "m5 12 4 4L19 6",
  mail: "M3 5h18v14H3V5Zm0 0 9 8 9-8",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Zm-8-3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z",
};
export function Icon({ name = "arrow", className = "", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d={paths[name] || paths.spark} />
      {name === "sun" && <circle cx="12" cy="12" r="4" />}
    </svg>
  );
}
export function Mark({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 94 106"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="dn-mark-shell"
        pathLength="1"
        d="M4 2h40c29 0 50 22 50 50 0 11-3 20-8 28-4-10-10-16-20-22 2-5 3-9 3-14 0-14-11-24-25-24H23C12 20 5 13 4 2Z"
        fill="var(--t-bright)"
      />
      <path
        className="dn-mark-wave"
        pathLength="1"
        d="M4 20C25 28 27 47 50 57c26 11 33 22 27 35-7 7-15 11-25 14 4-18-3-28-21-33C12 68 4 59 4 43V20Z"
        fill="var(--accent)"
      />
    </svg>
  );
}
export function Brand() {
  return (
    <span className="dn-brand">
      <Mark />
      <span>
        Devnandan <small>IT SOLUTIONS</small>
      </span>
    </span>
  );
}
export function Ribbon({ className = "" }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      className={className}
      viewBox="0 0 400 440"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={id}
          x1="60"
          y1="0"
          x2="330"
          y2="380"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#b8dbff" />
          <stop offset=".24" stopColor="#2f8cff" />
          <stop offset=".55" stopColor="#0b50c9" />
          <stop offset=".8" stopColor="#083185" />
          <stop offset="1" stopColor="#73b6ff" />
        </linearGradient>
        <linearGradient
          id={id + "b"}
          x1="50"
          y1="90"
          x2="310"
          y2="390"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8fcfff" />
          <stop offset=".3" stopColor="#237fff" />
          <stop offset="1" stopColor="#082c85" />
        </linearGradient>
      </defs>
      <path
        d="M45 29h145c110 0 172 78 172 174 0 41-15 77-39 105-10-36-32-59-68-82 10-17 15-35 15-53 0-52-38-87-90-87H111C77 86 50 64 45 29Z"
        fill={`url(#${id})`}
        stroke="#6baaff"
        strokeWidth="1"
      />
      <path
        d="M45 101c66 24 81 92 152 123 87 37 117 75 98 123-24 27-56 45-96 58 16-65-15-96-73-113-60-17-81-52-81-104v-87Z"
        fill={`url(#${id}b)`}
        stroke="#4e9fff"
        strokeWidth="1"
      />
      <path
        d="M48 103c66 26 80 91 151 123 78 35 111 65 97 120"
        stroke="#90c6ff"
        strokeWidth="2"
        opacity=".6"
      />
    </svg>
  );
}
