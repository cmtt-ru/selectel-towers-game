interface GameServerStackOptionsInterface {
  stackServerSpeed: number,
  currentShiftForContainer: number,
  newServerContainerX: number,
  currentShiftForStartServer: number,
  desktop: {
    currentBottomPadding: number,
    server: {
      width: number,
      height: number,
    },
    start: {
      width: number,
      height: number,
    },
  },
  mobile: {
    currentBottomPadding: number,
    server: {
      width: number,
      height: number,
    },
    start: {
      width: number,
      height: number,
    },
  },
}

export default GameServerStackOptionsInterface;
