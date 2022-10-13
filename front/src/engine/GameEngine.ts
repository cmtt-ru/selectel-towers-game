import * as CorePIXI from 'pixi.js';
import PIXI from '@/helpers/PixiExtension';
import GameEngineInterface from '@/types/GameEngineInterface';
import GameObjectsInterface from '@/types/GameObjectsInterface';
import GameCraneResolve from '@/types/GameCraneResolveInterface';
import GameBackground from './gameObjects/GameBackground';
import GameCrane from './gameObjects/GameCrane';
import GameDino from './gameObjects/GameDino';
import GameServerStack from './gameObjects/GameServerStack';
import GameServer from './gameObjects/GameServer';
import GameEventsManager from './services/GameEventsManager';

class GameEngine implements GameEngineInterface {
  private gameContainer?: HTMLDivElement;

  private gameObjects: GameObjectsInterface = {};

  private manifest = './assets/manifest.json';

  private isAction = false;

  private isMobile = false;

  private isAssetsLoad = false;

  public eventController: GameEventsManager;

  public app?: CorePIXI.Application;

  public options = {
    backgroundPositionPercent: 0,
    maxHeightGameContainer: 924,
    backgroundUpStepPercent: {
      desktop: 0.9,
      mobile: 1.25,
    },

    dinoStartPercent: 50,
    randomTimeForShowDino: {
      cloak: {
        from: 1000,
        to: 2500,
      },
      airplane: {
        from: 500,
        to: 1000,
      },
      rocket: {
        from: 1,
        to: 500,
      },
    },

    currentWidthForApp: 0,
    currentHeightForApp: 0,
  };

  private get isMobileToText() {
    return this.isMobile ? 'mobile' : 'desktop';
  }

  constructor(gameContainer: HTMLDivElement, isAssetsLoad: boolean) {
    this.gameContainer = gameContainer;

    this.eventController = GameEventsManager.getInstance();
    this.eventController.prepare(this);

    this.isAssetsLoad = isAssetsLoad;
  }

  private setBackgroundPosition() {
    const background = this.gameObjects.background as GameBackground;
    const { backgroundStartPercent } = background;

    if (
      this.options.backgroundPositionPercent
      + backgroundStartPercent
      + this.options.backgroundUpStepPercent[this.isMobileToText] < 100
    ) {
      this.options.backgroundPositionPercent
        += this.options.backgroundUpStepPercent[this.isMobileToText];
    } else {
      this.options.backgroundPositionPercent = 100;
    }
  }

  private resize() {
    const dino = this.gameObjects.dino as GameDino;
    const background = this.gameObjects.background as GameBackground;
    const crane = this.gameObjects.crane as GameCrane;
    const gameServerStack = this.gameObjects.gameServerStack as GameServerStack;

    this.isMobile = window.matchMedia('(max-width: 791px)').matches;
    this.setCurrentSizeForApp();

    if (this.app) {
      this.app?.renderer.resize(
        this.options.currentWidthForApp,
        this.options.currentHeightForApp,
      );

      background.isMobile = this.isMobile;
      background.resizeHandler();

      dino.isMobile = this.isMobile;

      crane.isMobile = this.isMobile;
      crane.resizeHandler();

      gameServerStack.isMobile = this.isMobile;
      gameServerStack.resizeHandler();
    }
  }

  private async loadAssets() {
    if (!this.isAssetsLoad) {
      await PIXI.Assets.init({ manifest: this.manifest });
    }

    PIXI.Assets.backgroundLoadBundle([
      'background-screen',
      'servers',
      'dragon',
    ]);
  }

  private async loadBackground() {
    const backgroundAsset = await PIXI.Assets.loadBundle('background-screen');
    const assets = [
      backgroundAsset.background_1,
      backgroundAsset.background_2,
      backgroundAsset.background_3,
      backgroundAsset.background_4,
    ];

    this.gameObjects.background = new GameBackground(
      assets,
      this,
    );
  }

  private setCurrentSizeForApp() {
    const background = this.gameObjects.background as GameBackground;

    const { backgroundWidth } = background;

    this.options.currentWidthForApp = window.innerWidth > backgroundWidth
      ? backgroundWidth
      : window.innerWidth;

    this.options.currentHeightForApp = window.innerHeight > this.options.maxHeightGameContainer
      ? this.options.maxHeightGameContainer
      : window.innerHeight;
  }

  public async createGame() {
    await this.loadAssets();
    await this.loadBackground();

    this.setCurrentSizeForApp();

    this.app = new PIXI.Application({
      backgroundColor: 0x0F3166,
      width: this.options.currentWidthForApp,
      height: this.options.currentHeightForApp,
      clearBeforeRender: true,
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio,
    });

    this.gameContainer?.appendChild(this.app.view);

    this.gameObjects.background.prepare();

    this.gameObjects.server = new GameServer(this);
    await this.gameObjects.server.prepare();

    this.gameObjects.crane = new GameCrane(this, this.gameObjects.server);
    await this.gameObjects.crane.prepare();

    this.gameObjects.gameServerStack = new GameServerStack(this, this.gameObjects.server);
    this.gameObjects.gameServerStack.prepare();

    this.gameObjects.dino = new GameDino(this);
    await this.gameObjects.dino.prepare();

    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
  }

  public async runGame() {
    const dino = this.gameObjects.dino as GameDino;
    const background = this.gameObjects.background as GameBackground;
    const crane = this.gameObjects.crane as GameCrane;
    const gameServerStack = this.gameObjects.gameServerStack as GameServerStack;

    dino.turnOnFly();

    const doOneRound = async (e: Event | KeyboardEvent) => {
      const handlerWrapper = async () => {
        if (!this.isAction) {
          this.isAction = true;

          this.setBackgroundPosition();

          const downCraneResolve = await crane.downCrane(
            dino.currentSprite as CorePIXI.Sprite,
          ) as GameCraneResolve;

          if (!downCraneResolve.isGameOver) {
            gameServerStack.addServer(downCraneResolve);
            crane.clawAnimate();

            const downStack = gameServerStack.downStack();
            const upCrane = crane.upCrane();
            const upBackground = background.upBackground();

            await Promise.all([upCrane, upBackground, downStack]);

            await crane.rightCrane();
            await crane.leftCrane();

            this.isAction = false;
          } else {
            dino.stopFlying();
            this.app?.view.removeEventListener('click', doOneRound);
            this.app?.view.removeEventListener('touchstart', doOneRound);
            window.removeEventListener('keydown', doOneRound);
            PIXI.utils.clearTextureCache();
            PIXI.Assets.cache.reset();
          }
        }
      };

      if (e.type !== 'keydown') {
        await handlerWrapper();
      } else if (
        (e as KeyboardEvent).code === 'Space'
        || (e as KeyboardEvent).code === 'ArrowDown'
      ) {
        await handlerWrapper();
      }
    };

    this.app?.view.addEventListener('touchstart', doOneRound);
    this.app?.view.addEventListener('click', doOneRound);
    window.addEventListener('keydown', doOneRound);
  }
}

export default GameEngine;
