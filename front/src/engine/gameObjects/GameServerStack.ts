import * as CorePIXI from 'pixi.js';
import PIXI from '@/helpers/PixiExtension';
import GameEngineInterface from '@/types/GameEngineInterface';
import GameCraneResolveInterface from '@/types/GameCraneResolveInterface';
import GameAnimationContextInterface from '@/types/GameAnimationContextInterface';
import GameSpritesBackgroundInterface from '@/types/sprites/GameSpritesBackgroundInterface';
import GameServerStackOptionsInterface from '@/types/options/GameServerStackOptionsInterface';
import GameObject from '@/types/GameObject';
import GameServer from '@/engine/gameObjects/GameServer';

class GameServerStack extends GameObject {
  private container: CorePIXI.Container;

  private gameServer: GameServer;

  private serverStackMultiplier = 1;

  private isStartBlockUnconnected = true;

  private options: GameServerStackOptionsInterface = {
    stackServerSpeed: 4,
    currentShiftForContainer: 7,
    newServerContainerX: -14,
    currentShiftForStartServer: -5,
    desktop: {
      currentBottomPadding: 20,
      server: {
        width: 109,
        height: 95,
      },
      start: {
        width: 95,
        height: 25,
      },
    },
    mobile: {
      currentBottomPadding: 100,
      server: {
        width: 91,
        height: 79,
      },
      start: {
        width: 79,
        height: 21,
      },
    },
  };

  protected engine: GameEngineInterface;

  protected sprites: GameSpritesBackgroundInterface;

  constructor(engine: GameEngineInterface, server: GameServer) {
    super();

    this.engine = engine;
    this.container = new PIXI.Container();
    this.gameServer = server;
    this.sprites = {
      startServer: this.gameServer.getSprite(0, 'off'),
    };
  }

  private setXPositionForStartServer() {
    this.sprites.startServer.x = this.options.currentShiftForStartServer;
  }

  public prepare() {
    this.container.addChild(this.sprites.startServer);
  }

  public addServer(server: GameCraneResolveInterface) {
    const currentServerContainer = server.sprite;
    const currentServerHeight = this.options[this.isMobileToText].server.height;
    const currentServer = currentServerContainer.getChildAt(0) as CorePIXI.Sprite;

    currentServer.texture = this.gameServer.getTexture(`server-${server.index}-on`);

    this.serverStackMultiplier += 1;

    currentServerContainer.y = -(currentServerHeight * this.serverStackMultiplier);
    currentServerContainer.x = this.options.newServerContainerX;

    this.container.addChild(currentServerContainer);
  }

  public resizeHandler() {
    const {
      currentWidthForApp,
      currentHeightForApp,
    } = this.engine.options;
    const currentServerHeight = this.options[this.isMobileToText].server.height;
    const { currentBottomPadding } = this.options[this.isMobileToText];

    const containerKeys = Object.keys(this.container.children);

    containerKeys.forEach((key, index) => {
      const currentKey = key as unknown as keyof typeof this.container.children;
      const nextIndex = index + 1;
      const currentContainer = this.container.children[currentKey] as CorePIXI.Container;
      const isStartServer = currentContainer.name === 'server-0-off'
        || currentContainer.name === 'server-0-on';

      const serverType = isStartServer
        ? 'start'
        : 'server';

      currentContainer.width = this.options[this.isMobileToText][serverType].width;
      currentContainer.height = this.options[this.isMobileToText][serverType].height;

      currentContainer.y = -(currentServerHeight * nextIndex);
    });

    const halfServerWidth = this.options[this.isMobileToText].server.width / 2;
    const halfWidthApp = currentWidthForApp / 2;
    const previousServerStackMultiplier = this.serverStackMultiplier - 1;

    this.container.x = halfWidthApp - halfServerWidth
      + this.options.currentShiftForContainer;
    this.container.y = currentHeightForApp
      - currentBottomPadding
      + (currentServerHeight * previousServerStackMultiplier);

    this.setXPositionForStartServer();

    this.engine.app?.stage.addChild(this.container);
  }

  public downStack() {
    const newEndPositionPoint = this.container.y
      + this.options[this.isMobileToText].server.height;

    const animationContext = (resolve: typeof Promise.resolve)
      : GameAnimationContextInterface => {
      const context: GameAnimationContextInterface = {
        displayObject: this.container,
        coordinate: 'y',
        speed: this.options.stackServerSpeed,
        prepareCallback: () => {
          if (this.isStartBlockUnconnected) {
            const startServer = this.container.getChildAt(0) as CorePIXI.Sprite;
            const newStartTexture = this.gameServer.getTexture('server-0-on');

            startServer.texture = newStartTexture;
            this.isStartBlockUnconnected = false;
          }

          return false;
        },
        isMove: () => this.container.y < newEndPositionPoint,
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

export default GameServerStack;
