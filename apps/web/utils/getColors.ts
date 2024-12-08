import clsx from "clsx";

export function getWinningProbabilityColor(probability: number) {
  return clsx("p-0.5 px-1 rounded-md", {
    "bg-red-600": probability <= 0.3,
    "bg-yellow-500": probability > 0.3 && probability < 0.7,
    "bg-green-600": probability >= 0.7,
  });
}
