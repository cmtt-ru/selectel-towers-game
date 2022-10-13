import * as CorePIXI from 'pixi.js';

interface GameSpritesServerInterface {
  [key: string]: {
    on: CorePIXI.Sprite,
    off: CorePIXI.Sprite,
  },
}

export default GameSpritesServerInterface;
