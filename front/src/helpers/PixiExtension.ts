import * as CorePIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import GameAnimationContextInterface from '@/types/GameAnimationContextInterface';

const PixiHelpers = {
  moveDisplayObject(this: GameAnimationContextInterface) {
    const {
      isMove,
      displayObject,
      coordinate,
      speed,
      prepareCallback,
      endAnimationCallback,
      resolve,
    } = this as unknown as GameAnimationContextInterface;

    if (prepareCallback) {
      const isEndAnimation = prepareCallback();

      if (isEndAnimation) {
        return;
      }
    }

    if (isMove()) {
      displayObject[coordinate] += speed;
    } else {
      endAnimationCallback();

      if (resolve) {
        resolve();
      }
    }
  },

  hitSprite(
    sprite: CorePIXI.Sprite,
    container1: CorePIXI.Container,
    container2: CorePIXI.Container,
  ) {
    const r1 = {
      centerX: 0,
      centerY: 0,
      halfWidth: 0,
      halfHeight: 0,
    };
    const r2 = {
      centerX: 0,
      centerY: 0,
      halfWidth: 0,
      halfHeight: 0,
    };
    let hit;

    hit = false;

    r1.centerX = sprite.x + sprite.width / 2;
    r1.centerY = sprite.y + sprite.height / 2;
    r2.centerX = container1.x + container1.width / 2;
    r2.centerY = container2.y + container1.height / 2;

    r1.halfWidth = sprite.width / 2;
    r1.halfHeight = sprite.height / 2;
    r2.halfWidth = container1.width / 2;
    r2.halfHeight = container1.height / 2;

    const vx = r1.centerX - r2.centerX;
    const vy = r1.centerY - r2.centerY;

    const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    const combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    if (Math.abs(vx) < combinedHalfWidths) {
      if (Math.abs(vy) < combinedHalfHeights) {
        hit = true;
      } else {
        hit = false;
      }
    } else {
      hit = false;
    }

    return hit;
  },
};

const PIXI = {
  ...CorePIXI,
  Assets,
  PixiHelpers,
};

export default PIXI;
