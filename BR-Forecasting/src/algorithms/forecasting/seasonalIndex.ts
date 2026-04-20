export const seasonalIndex = (values: number[], seasonLength: number) => {
  const chunks = Array.from({ length: seasonLength }, (_, offset) =>
    values.filter((_, index) => index % seasonLength === offset),
  );
  const overall = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
  return chunks.map((chunk) => {
    const average = chunk.reduce((sum, value) => sum + value, 0) / Math.max(chunk.length, 1);
    return average / Math.max(overall, 1);
  });
};
