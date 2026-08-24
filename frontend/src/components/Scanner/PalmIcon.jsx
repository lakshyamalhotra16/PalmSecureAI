export default function PalmIcon() {
  return (
    <svg
      className="scanner-palm"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Thumb */}
        <path d="M70 115 C52 104 48 82 60 72" />

        {/* Palm */}
        <path d="
            M70 115
            L70 60
            C70 50 82 50 82 60
            L82 110

            L82 48
            C82 38 95 38 95 48
            L95 110

            L95 40
            C95 30 108 30 108 40
            L108 110

            L108 52
            C108 42 120 42 120 52
            L120 118

            C120 145 104 165 84 165

            C62 165 48 148 48 125

            L48 96
            C48 88 56 86 62 91

            L70 100
        " />

        {/* Palm Creases */}
        <path d="M70 125 C82 132 98 132 110 122" />
        <path d="M72 140 C84 147 98 147 108 138" />
      </g>
    </svg>
  );
}