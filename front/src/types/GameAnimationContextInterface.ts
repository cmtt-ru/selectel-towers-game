import * as CorePIXI from 'pixi.js';

interface GameAnimationContextInterface {
  displayObject: CorePIXI.Sprite | CorePIXI.Container,
  coordinate: 'x' | 'y',
  speed: number,
  isMove: () => boolean,
  endAnimationCallback: () => void,
  prepareCallback?: () => boolean,
  resolve?: typeof Promise.resolve,
}

export default GameAnimationContextInterface;
