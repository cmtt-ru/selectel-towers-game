interface GameBackgroundOptionsInterface {
  backgroundSpeed: number,
  desktop: {
    [key: number]: {
      width: number,
      height: number,
    },
    backgroundStartPercent: number,
  },
  mobile: {
    [key: number]: {
      width: number,
      height: number,
    },
    backgroundStartPercent: number,
  },
}

export default GameBackgroundOptionsInterface;
