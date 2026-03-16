export default function LoadingSpinner({
  size = "md",
}: { size?: "sm" | "md" | "lg" }) {
  const cls =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-12 w-12" : "h-8 w-8";
  return (
    <div
      className={`${cls} border-2 border-primary/30 border-t-primary rounded-full animate-spin`}
    />
  );
}
