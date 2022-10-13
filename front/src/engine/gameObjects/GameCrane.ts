import * as CorePIXI from 'pixi.js';
import PIXI from '@/helpers/PixiExtension';
import GameObject from '@/types/GameObject';
import GameEngineInterface from '@/types/GameEngineInterface';
import GameSpritesCraneInterface from '@/types/sprites/GameSpritesCraneInterface';
import GameAnimationContextInterface from '@/types/GameAnimationContextInterface';
import _ from 'lodash';
import GameEventsEnum from '@/constants/GameEventsEnum';
import GameServer from './GameServer';

class GameBracket extends GameObject {
  private container: CorePIXI.Container;

  private server: GameServer;

  private currentServerIndex = 0;

  private currentServerCount = 0;

  private spriteSheetPath = './assets/crane/crane-spritesheet.json';

  protected sprites: GameSpritesCraneInterface = {};

  protected engine: GameEngineInterface;

  options = {
    mobileSizeModifier: 1.2,
    offsetXForServerSprite: 16,
    offsetYForServerSprite: 60,
    containerXOffset: 8,
    desktop: {
      bracket: {
        width: 0,
        height: 0,
      },
      server: {
        width: 0,
        height: 0,
      },
      crane: {
        width: 0,
        height: 0,
      },
    },
    mobile: {
      bracket: {
        width: 0,
        height: 0,
      },
      server: {
        width: 0,
        height: 0,
      },
      crane: {
        width: 0,
        height: 0,
      },
    },
  };

  private get craneSpeedX() {
    const {
      currentWidthForApp,
    } = this.engine.options;

    return currentWidthForApp / 35;
  }

  private get craneSpeedY() {
    const {
      currentHeightForApp,
    } = this.engine.options;

    return currentHeightForApp / 35;
  }

  constructor(engine: GameEngineInterface, server: GameServer) {
    super();

    this.engine = engine;
    this.container = new PIXI.Container();
    this.server = server;
  }

  private resizeHandlerForServer() {
    if (this.sprites.server) {
      this.sprites.server.width = this.options[this.isMobileToText].server.width;
      this.sprites.server.height = this.options[this.isMobileToText].server.height;
    }

    if (this.sprites.crane) {
      if (this.sprites.containerForServerSprite) {
        this.sprites.containerForServerSprite.x = (this.sprites.crane.width / 100)
          * this.options.offsetXForServerSprite;
        this.sprites.containerForServerSprite.y = (this.sprites.crane.height / 100)
          * this.options.offsetYForServerSprite;
      }
    }
  }

  public downCrane(dinoSprite: CorePIXI.Sprite) {
    const craneContainer = this.container.getChildByName('craneContainer') as CorePIXI.Container;

    const {
      currentHeightForApp,
    } = this.engine.options;

    const newEndPositionPoint = this.isMobile
      ? currentHeightForApp - 320
      : currentHeightForApp - 280;

    const animationContext = (resolve: typeof Promise.resolve)
      : GameAnimationContextInterface => {
      const context: GameAnimationContextInterface = {
        displayObject: this.container,
        coordinate: 'y',
        speed: this.craneSpeedY,
        isMove: () => this.container.y < newEndPositionPoint,
        prepareCallback: () => {
          const isCollision = PIXI.PixiHelpers.hitSprite(
            dinoSprite,
            craneContainer,
            this.container,
          );

          if (isCollision) {
            this.engine.app?.ticker.remove(
              PIXI.PixiHelpers.moveDisplayObject,
              context,
            );

            resolve({
              index: this.currentServerIndex,
              isGameOver: true,
            });

            this.engine.eventController.dispatchEvent(GameEventsEnum.gameOver);

            return true;
          }

          return false;
        },
        endAnimationCallback: () => {
          this.container.y = newEndPositionPoint;

          this.container.y = newEndPositionPoint;
          this.engine.eventController.dispatchEvent(GameEventsEnum.incrementCounter);
          this.currentServerCount += 1;

          if (this.currentServerCount === 100) {
            this.engine.eventController.dispatchEvent(GameEventsEnum.showPopUpGreat);
          }

          if (this.sprites.container) {
            const server = this.sprites.container.getChildByName('server');
            this.sprites.container.removeChild(server);

            this.engine.app?.ticker.remove(
              PIXI.PixiHelpers.moveDisplayObject,
              context,
            );

            resolve({
              index: this.currentServerIndex,
              isGameOver: false,
              sprite: server,
            });
          }
        },
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

  public upCrane() {
    const newEndPositionPoint = 0;

    const animationContext = (resolve: typeof Promise.resolve)
    : GameAnimationContextInterface => {
      const context: GameAnimationContextInterface = {
        displayObject: this.container,
        coordinate: 'y',
        speed: -this.craneSpeedY,
        isMove: () => this.container.y > newEndPositionPoint,
        endAnimationCallback: () => {
          this.container.y = newEndPositionPoint;
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

  public rightCrane() {
    const {
      currentWidthForApp,
    } = this.engine.options;

    const craneHalfWidth = (this.sprites.container?.width ?? 0) / 2;

    const newEndPositionPoint = currentWidthForApp + craneHalfWidth;

    const animationContext = (resolve: typeof Promise.resolve)
    : GameAnimationContextInterface => {
      const container = this.sprites.container as CorePIXI.Container;

      const context: GameAnimationContextInterface = {
        displayObject: container,
        coordinate: 'x',
        speed: this.craneSpeedX,
        isMove: () => container.x < newEndPositionPoint,
        endAnimationCallback: () => {
          container.x = newEndPositionPoint;

          const crane = container.getChildByName('crane') as CorePIXI.AnimatedSprite;
          crane.gotoAndStop(0);

          this.currentServerIndex = _.random(1, 3);
          const serverSprite = this.server.getSprite(this.currentServerIndex, 'off');
          this.sprites.server = serverSprite;

          const containerForServerSprite = new PIXI.Container();
          containerForServerSprite.name = 'server';
          containerForServerSprite.addChild(serverSprite);
          containerForServerSprite.y = ((this.sprites.crane?.width ?? 0) / 100)
            * this.options.offsetXForServerSprite;
          containerForServerSprite.x = ((this.sprites.crane?.height ?? 0) / 100)
            * this.options.offsetYForServerSprite;

          this.sprites.containerForServerSprite = containerForServerSprite;
          this.resizeHandlerForServer();

          container.addChildAt(containerForServerSprite, 0);

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

  public leftCrane() {
    const {
      currentWidthForApp,
    } = this.engine.options;
    const craneHalfWidth = (this.sprites.container?.width ?? 0) / 2;

    const newEndPositionPoint = (currentWidthForApp / 2) - craneHalfWidth;

    const animationContext = (resolve: typeof Promise.resolve)
    : GameAnimationContextInterface => {
      const container = this.sprites.container as CorePIXI.Container;

      const context: GameAnimationContextInterface = {
        displayObject: container,
        coordinate: 'x',
        speed: -this.craneSpeedX,
        isMove: () => container.x > newEndPositionPoint,
        endAnimationCallback: () => {
          container.x = newEndPositionPoint;
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

  public async prepare() {
    this.assets = await PIXI.Assets.loadBundle('crane');

    const {
      currentWidthForApp,
    } = this.engine.options;

    const bracket = PIXI.Sprite.from(this.assets.bracket);
    this.sprites.bracket = bracket;
    this.container.addChild(bracket);

    this.options.desktop.bracket.width = bracket.width;
    this.options.mobile.bracket.width = bracket.width
      / this.options.mobileSizeModifier;
    this.options.desktop.bracket.height = bracket.height;
    this.options.mobile.bracket.height = bracket.height
      / this.options.mobileSizeModifier;

    const container = new PIXI.Container();
    container.name = 'craneContainer';

    this.currentServerIndex = _.random(1, 3);
    const serverSprite = this.server.getSprite(this.currentServerIndex, 'off');
    this.sprites.server = serverSprite;

    this.options.desktop.server.width = serverSprite.width;
    this.options.mobile.server.width = serverSprite.width / 1.2;
    this.options.desktop.server.height = serverSprite.height;
    this.options.mobile.server.height = serverSprite.height / 1.2;

    const sheet = await PIXI.Assets.load(this.spriteSheetPath) as CorePIXI.Spritesheet;
    const crane = new PIXI.AnimatedSprite(sheet.animations.crane);
    crane.name = 'crane';
    crane.width /= 2;
    crane.height /= 2;
    crane.loop = false;
    this.sprites.crane = crane;

    const containerForServerSprite = new PIXI.Container();
    containerForServerSprite.name = 'server';
    containerForServerSprite.addChild(serverSprite);
    containerForServerSprite.x = (crane.width / 100) * this.options.offsetXForServerSprite;
    containerForServerSprite.y = (crane.height / 100) * this.options.offsetYForServerSprite;
    this.sprites.containerForServerSprite = containerForServerSprite;

    this.options.desktop.crane.width = crane.width;
    this.options.mobile.crane.width = crane.width / 1.2;
    this.options.desktop.crane.height = crane.height;
    this.options.mobile.crane.height = crane.height / 1.2;

    container.addChild(containerForServerSprite);
    container.addChild(crane);

    const craneHalfWidth = container.width / 2;
    container.x = (currentWidthForApp / 2) - craneHalfWidth;
    container.y = this.options.containerXOffset;

    this.sprites.container = container;
    this.container.addChild(container);
  }

  public resizeHandler() {
    const {
      currentWidthForApp,
    } = this.engine.options;

    if (this.sprites.bracket) {
      this.sprites.bracket.width = this.options[this.isMobileToText].bracket.width;
      this.sprites.bracket.height = this.options[this.isMobileToText].bracket.height;
    }

    if (this.sprites.crane) {
      this.sprites.crane.width = this.options[this.isMobileToText].crane.width;
      this.sprites.crane.height = this.options[this.isMobileToText].crane.height;
    }

    this.resizeHandlerForServer();

    if (this.sprites.container) {
      const craneHalfWidth = this.sprites.container.width / 2;
      this.sprites.container.x = (currentWidthForApp / 2) - craneHalfWidth;
    }

    this.engine.app?.stage.addChild(this.container);
  }

  public clawAnimate() {
    const crane = this.sprites.container?.getChildByName('crane') as CorePIXI.AnimatedSprite;
    crane.play();
  }
}

export default GameBracket;
