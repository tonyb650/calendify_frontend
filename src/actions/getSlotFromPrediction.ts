export default function getSlotFromPrediction(prediction: number[]): number {
  const highestProbability = Math.max(...prediction);
  return prediction.indexOf(highestProbability);
}
