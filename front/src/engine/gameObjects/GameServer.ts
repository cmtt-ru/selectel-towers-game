import * as CorePIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import GameObject from '@/types/GameObject';
import GameEngineInterface from '@/types/GameEngineInterface';
import GameSpritesServerInterface from '@/types/sprites/GameSpritesServerInterface';
import _ from 'lodash';

const PIXI = {
  ...CorePIXI,
  Assets,
};

class GameServer extends GameObject {
  private positionOfNumberInKey = 7;

  protected sprites: GameSpritesServerInterface = {};

  protected engine: GameEngineInterface;

  constructor(engine: GameEngineInterface) {
    super();

    this.engine = engine;
  }

  async prepare() {
    this.assets = await PIXI.Assets.loadBundle('servers');

    Object.keys(this.assets).forEach((key: string) => {
      const correctKey = key as string;
      const index = correctKey[this.positionOfNumberInKey];
      const isOnSprite = correctKey.indexOf('on') > -1;

      const sprite = PIXI.Sprite.from(this.assets[key]);
      sprite.name = correctKey;

      this.sprites[index] = this.sprites[index] ?? {};
      this.sprites[index][isOnSprite ? 'on' : 'off'] = sprite;
    });
  }

  getSprite(index: number, type: 'on' | 'off') {
    return _.cloneDeep(this.sprites[index][type]);
  }

  getTexture(name: string) {
    return this.assets[name];
  }
}

export default GameServer;
