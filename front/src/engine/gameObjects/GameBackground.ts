import * as CorePIXI from 'pixi.js';
import PIXI from '@/helpers/PixiExtension';
import GameObject from '@/types/GameObject';
import GameAnimationContextInterface from '@/types/GameAnimationContextInterface';
import GameEngineInterface from '@/types/GameEngineInterface';
import GameBackgroundOptionsInterface from '@/types/options/GameBackgroundOptionsInterface';

class GameBackground extends GameObject {
  private container: CorePIXI.Container;

  options: GameBackgroundOptionsInterface = {
    backgroundSpeed: 4,
    desktop: {
      backgroundStartPercent: 5,
    },
    mobile: {
      backgroundStartPercent: 3,
    },
  };

  protected sprites: CorePIXI.Sprite[] = [];

  protected engine: GameEngineInterface;

  private get backgroundHeight() {
    return this.container.height;
  }

  private get currentBackgroundPosition() {
    const {
      backgroundPositionPercent,
    } = this.engine.options;

    return Math.round(
      (this.backgroundHeight / 100)
      * (backgroundPositionPercent
      + this.backgroundStartPercent),
    );
  }

  public get backgroundStartPercent() {
    return this.options[this.isMobileToText].backgroundStartPercent;
  }

  public get backgroundWidth() {
    return this.container.width;
  }

  constructor(
    assets: CorePIXI.Texture[],
    engine: GameEngineInterface,
  ) {
    super();
    this.container = new PIXI.Container();

    assets.forEach((asset) => {
      const sprite = PIXI.Sprite.from(asset);
      this.sprites.push(sprite);
      this.container.addChild(sprite);
    });

    this.engine = engine;
  }

  private arrangeBackgroundElements() {
    const reverseSprites = [...this.sprites].reverse();
    const spritesLength = reverseSprites.length;
    const lastSpriteIndex = spritesLength - 1;
    const penultimateSpriteIndex = spritesLength - 2;

    reverseSprites.forEach((sprite, index, sprites) => {
      const currentSprite = sprite;
      const reverseIndex = lastSpriteIndex - index;
      const nextSpriteIndex = index - 1;

      if (penultimateSpriteIndex === reverseIndex) {
        currentSprite.y = sprites[nextSpriteIndex].height;
      } else if (lastSpriteIndex !== reverseIndex) {
        currentSprite.y = sprites[nextSpriteIndex].y
          + sprites[nextSpriteIndex].height;
      }
    });
  }

  public resizeHandler() {
    const {
      currentWidthForApp,
      currentHeightForApp,
    } = this.engine.options;

    this.sprites.forEach((sprite, index) => {
      const currentSprite = sprite;

      currentSprite.width = this.options[this.isMobileToText][index].width;
      currentSprite.height = this.options[this.isMobileToText][index].height;
    });

    this.arrangeBackgroundElements();

    this.container.x = (currentWidthForApp - this.backgroundWidth) / 2;
    this.container.y = -this.backgroundHeight
      + currentHeightForApp
      + this.currentBackgroundPosition;

    this.engine.app?.stage.addChild(this.container);
  }

  public prepare() {
    this.sprites.forEach((sprite, index) => {
      this.options.desktop[index] = {
        height: sprite.height,
        width: sprite.width,
      };
      this.options.mobile[index] = {
        height: sprite.height / 2,
        width: sprite.width / 2,
      };
    });
  }

  public upBackground() {
    const {
      currentHeightForApp,
    } = this.engine.options;

    const newEndPositionPoint = -this.backgroundHeight
      + currentHeightForApp
      + this.currentBackgroundPosition;

    const animationContext = (resolve: typeof Promise.resolve)
      : GameAnimationContextInterface => {
      const context: GameAnimationContextInterface = {
        displayObject: this.container,
        coordinate: 'y',
        speed: this.options.backgroundSpeed,
        isMove: () => this.container.y < newEndPositionPoint && this.container.y < 0,
        endAnimationCallback: () => {
          this.engine.app?.ticker.remove(
            PIXI.PixiHelpers.moveDisplayObject,
            context,
          );
        },
        resolve,
      };

      return context;
    };

    return new Promise((resolve) => {
      this.engine.app?.ticker.add(
        PIXI.PixiHelpers.moveDisplayObject,
        animationContext(resolve as typeof Promise.resolve),
      );
    });
  }
}

export default GameBackground;
