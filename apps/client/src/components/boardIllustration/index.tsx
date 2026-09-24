interface Props {
  className?: string;
}

const BoardIllustration = ({ className }: Props) => {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g
        className="animate-illustration-col"
        style={{ animationDelay: "0ms, 0ms", transformOrigin: "29px 60px" }}
      >
        <rect
          x="8"
          y="10"
          width="42"
          height="100"
          rx="8"
          stroke="currentColor"
          strokeOpacity="0.25"
        />
        <rect x="16" y="22" width="26" height="18" rx="4" fill="#c1602d" />
        <rect
          x="16"
          y="48"
          width="26"
          height="14"
          rx="4"
          stroke="currentColor"
          strokeOpacity="0.4"
        />
      </g>

      <g
        className="animate-illustration-col"
        style={{
          animationDelay: "80ms, 400ms",
          animationDuration: "500ms, 5s",
          transformOrigin: "80px 60px",
        }}
      >
        <rect
          x="59"
          y="10"
          width="42"
          height="100"
          rx="8"
          stroke="currentColor"
          strokeOpacity="0.25"
        />
        <rect
          x="67"
          y="22"
          width="26"
          height="14"
          rx="4"
          stroke="currentColor"
          strokeOpacity="0.4"
        />
        <rect
          x="67"
          y="44"
          width="26"
          height="22"
          rx="4"
          stroke="currentColor"
          strokeOpacity="0.4"
        />
      </g>

      <g
        className="animate-illustration-col"
        style={{
          animationDelay: "160ms, 800ms",
          animationDuration: "500ms, 4s",
          transformOrigin: "131px 60px",
        }}
      >
        <rect
          x="110"
          y="10"
          width="42"
          height="100"
          rx="8"
          stroke="currentColor"
          strokeOpacity="0.25"
        />
        <rect
          x="118"
          y="22"
          width="26"
          height="14"
          rx="4"
          stroke="currentColor"
          strokeOpacity="0.4"
        />
      </g>
    </svg>
  );
};

export default BoardIllustration;
