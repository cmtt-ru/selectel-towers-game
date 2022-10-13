import * as CorePIXI from 'pixi.js';
import GameObject from '@/types/GameObject';
import PIXI from '@/helpers/PixiExtension';
import GameEngineInterface from '@/types/GameEngineInterface';
import GameSpritesDinoInterface from '@/types/sprites/GameSpritesDinoInterface';
import GameAnimationContextInterface from '@/types/GameAnimationContextInterface';
import GameDinoOptionsInterface from '@/types/options/GameDinoOptionsInterface';
import _ from 'lodash';

type direction = 'left' | 'right';

class GameDino extends GameObject {
  private isStopFlying = false;

  private directions = ['left', 'right']

  private currentDirection: direction = 'left';

  private options: GameDinoOptionsInterface = {
    mobileSizeModifier: 1.2,
    maxDeviationPercentForYPosition: 15,
    percentForShowDinoType: {
      airplane: 28,
      rocket: 55,
    },
    dinoSpeed: {
      cloak: 2,
      airplane: 1.5,
      rocket: 1,
    },
    desktop: {},
    mobile: {},
  }

  protected sprites: GameSpritesDinoInterface = {};

  protected engine: GameEngineInterface;

  public currentSprite?: CorePIXI.Sprite;

  private get dinoHeight() {
    return this.currentSprite?.height ?? 0;
  }

  private get dinoSpeedRatio() {
    const {
      currentWidthForApp,
    } = this.engine.options;

    return currentWidthForApp / 80;
  }

  constructor(engine: GameEngineInterface) {
    super();

    this.engine = engine;
  }

  public async prepare() {
    this.assets = await PIXI.Assets.loadBundle('dino');

    Object.keys(this.assets).forEach((key: string) => {
      const {
        currentHeightForApp,
        currentWidthForApp,
      } = this.engine.options;

      const correctKey = key as keyof GameSpritesDinoInterface;
      const currentSprite = PIXI.Sprite.from(this.assets[key]);

      currentSprite.name = key;
      currentSprite.alpha = 0;

      currentSprite.x = -currentWidthForApp;
      currentSprite.y = -currentHeightForApp;

      this.sprites[correctKey] = currentSprite;

      this.options.desktop[key] = {
        width: currentSprite.width,
        height: currentSprite.height,
      };
      this.options.mobile[key] = {
        width: currentSprite.width / this.options.mobileSizeModifier,
        height: currentSprite.height / this.options.mobileSizeModifier,
      };
    });
  }

  private resizeHandler() {
    const {
      currentHeightForApp,
      dinoStartPercent,
    } = this.engine.options;

    const halfDinoHeight = this.dinoHeight / 2;
    const percentToPixelYPosition = -Math.round((currentHeightForApp / 100) * dinoStartPercent);

    if (this.currentSprite) {
      const {
        width,
        height,
      } = this.options[this.isMobileToText][this.currentSprite.name];

      this.currentSprite.width = width;
      this.currentSprite.height = height;
      this.currentSprite.y = currentHeightForApp - halfDinoHeight + percentToPixelYPosition;

      this.engine.app?.stage.addChild(this.currentSprite);
    }
  }

  private changeCurrentDinoSprite() {
    const {
      currentHeightForApp,
      backgroundPositionPercent,
    } = this.engine.options;

    if (backgroundPositionPercent < this.options.percentForShowDinoType.airplane) {
      this.currentSprite = this.sprites.cloak;
    } else if (backgroundPositionPercent < this.options.percentForShowDinoType.rocket) {
      this.currentSprite = this.sprites.airplane;
    } else {
      this.currentSprite = this.sprites.rocket;
    }

    if (this.currentSprite) {
      this.currentSprite.y = -currentHeightForApp;
    }

    this.currentSprite?.anchor.set(this.currentDirection === 'left' ? 0 : 1, 0);

    this.currentSprite?.setTransform(
      this.currentSprite.x,
      this.currentSprite.y,
      this.currentDirection === 'left' ? 1 : -1,
    );
  }

  private setDinoDirection() {
    const lastIndexOfDirection = this.directions.length - 1;
    const randomIndexOfDirections = _.random(0, lastIndexOfDirection);

    this.currentDirection = this.directions[randomIndexOfDirections] as direction;
  }

  private getRandomTimeForShowDino() {
    const {
      randomTimeForShowDino,
    } = this.engine.options;

    const currentSpriteName = this.currentSprite?.name ?? 'cloak';

    const randomTimeToStartDinoFly = _.random(
      randomTimeForShowDino[currentSpriteName].from,
      randomTimeForShowDino[currentSpriteName].to,
    );

    return randomTimeToStartDinoFly;
  }

  private startCircleFly(timer: number) {
    const {
      currentWidthForApp,
      currentHeightForApp,
      dinoStartPercent,
    } = this.engine.options;

    setTimeout(() => {
      if (!this.currentSprite) {
        return;
      }

      const halfDinoHeight = this.dinoHeight / 2;
      const percentToPixelYPosition = -Math.round((currentHeightForApp / 100) * dinoStartPercent);
      const randomPercentForYDinoOffset = _.random(0, this.options.maxDeviationPercentForYPosition);
      const currentPercentForYDinoOffset = _.random(0, 1)
        ? randomPercentForYDinoOffset
        : -randomPercentForYDinoOffset;
      const yDinoOffset = -Math.round((currentHeightForApp / 100) * currentPercentForYDinoOffset);

      this.resizeHandler();

      if (this.currentDirection === 'left') {
        this.currentSprite.x = currentWidthForApp;
      } else {
        this.currentSprite.x = -this.currentSprite.width;
      }

      this.currentSprite.y = currentHeightForApp - halfDinoHeight
        + percentToPixelYPosition + yDinoOffset;

      this.engine.app?.stage.addChild(this.currentSprite);

      this.currentSprite.alpha = 1;

      const isLeftDirection = this.currentDirection === 'left';

      const animationContext = (): GameAnimationContextInterface => {
        const sprite = this.currentSprite as CorePIXI.Sprite;
        const currentSpriteName = this.currentSprite?.name ?? 'cloak';
        const keyForDinoSpeed = currentSpriteName as keyof typeof this.options.dinoSpeed;
        const dinoSpeed = this.options.dinoSpeed[keyForDinoSpeed] * this.dinoSpeedRatio;

        const context: GameAnimationContextInterface = {
          displayObject: sprite,
          coordinate: 'x',
          speed: isLeftDirection ? -dinoSpeed : dinoSpeed,
          prepareCallback: () => {
            if (this.isStopFlying) {
              this.engine.app?.ticker.remove(
                PIXI.PixiHelpers.moveDisplayObject,
                context,
              );
              return true;
            }

            return false;
          },
          isMove: () => (isLeftDirection
            ? sprite.x > -sprite.width
            : sprite.x < currentWidthForApp + sprite.width),
          endAnimationCallback: () => {
            this.engine.app?.stage.removeChild(sprite);
            this.engine.app?.ticker.remove(
              PIXI.PixiHelpers.moveDisplayObject,
              context,
            );

            this.turnOnFly();
          },
        };

        return context;
      };

      this.engine.app?.ticker.add(
        PIXI.PixiHelpers.moveDisplayObject,
        animationContext(),
      );
    }, timer);
  }

  public turnOnFly() {
    this.setDinoDirection();
    this.changeCurrentDinoSprite();
    this.resizeHandler();

    const randomTimeToStartDinoFly = this.getRandomTimeForShowDino();
    this.startCircleFly(randomTimeToStartDinoFly);
  }

  public stopFlying() {
    this.isStopFlying = true;
  }
}

export default GameDino;
