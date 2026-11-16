import type { Circuit } from "./types";

const straightLengthInMiles = 0.2
const cornerLengthInMiles = 0.05

export const squareCircuit: Circuit = {
  name: 'Square Circuit',
  lapLengthInMiles: 1,
  corners: [0, 1, 2, 3].map(x => ({
    startInMiles: ((straightLengthInMiles + cornerLengthInMiles) * x) + (straightLengthInMiles / 2),
    lengthInMiles: cornerLengthInMiles,
    direction: 'right'
  }))
}
