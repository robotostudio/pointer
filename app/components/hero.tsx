export function Hero({variant}:{variant: "default" | "centered" | "full-width"}) {
  return (
    <div>
      <h1>Hero</h1>
      <div>{variant}</div>
    </div>
  );
};