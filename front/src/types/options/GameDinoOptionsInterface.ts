interface GameDinoOptionsInterface {
  mobileSizeModifier: number,
  maxDeviationPercentForYPosition: number,
  percentForShowDinoType: {
    airplane: number,
    rocket: number,
  },
  dinoSpeed: {
    cloak: number,
    airplane: number,
    rocket: number,
  },
  desktop: {
    [key: string]: {
      width: number,
      height: number,
    }
  },
  mobile: {
    [key: string]: {
      width: number,
      height: number,
    }
  },
}

export default GameDinoOptionsInterface;
