/* eslint-disable import/no-cycle */
import * as CorePIXI from 'pixi.js';
import GameEventsManager from '@/engine/services/GameEventsManager';

interface GameEngineInterface {
  app?: CorePIXI.Application,
  eventController: GameEventsManager,
  options: {
    [key: string]: number | object,
    randomTimeForShowDino: {
      [key: string]: {
        from: number,
        to: number,
      }
    },
    backgroundPositionPercent: number,
    dinoStartPercent: number,
    currentWidthForApp: number,
    currentHeightForApp: number,
  }
}

export default GameEngineInterface;
