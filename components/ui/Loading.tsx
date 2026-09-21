export default function Loading({ label = "V" }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray="185 79"
          />
        </svg>

        <svg
          className="absolute inset-0 h-full w-full animate-spin"
          style={{ animationDuration: "1.1s" }}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#1F2937"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray="55 209"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-extrabold text-gray-800">{label}</span>
        </div>
      </div>
    </div>
  );
}