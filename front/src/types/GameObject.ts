import * as CorePIXI from 'pixi.js';
import GameEngineInterface from '@/types/GameEngineInterface';
import GameAssetsInterface from '@/types/GameAssetsInterface';
import GameSpritesDinoInterface from '@/types/sprites/GameSpritesDinoInterface';
import GameSpritesCraneInterface from '@/types/sprites/GameSpritesCraneInterface';
import GameSpritesServerInterface from '@/types/sprites/GameSpritesServerInterface';
import GameSpritesBackgroundInterface from '@/types/sprites/GameSpritesBackgroundInterface';

abstract class GameObject {
  protected abstract sprites: CorePIXI.Sprite[]
  | GameSpritesDinoInterface
  | GameSpritesServerInterface
  | GameSpritesCraneInterface
  | GameSpritesBackgroundInterface;

  protected abstract engine: GameEngineInterface;

  protected assets: GameAssetsInterface = {};

  public isMobile = false;

  protected get isMobileToText() {
    return this.isMobile ? 'mobile' : 'desktop';
  }

  public abstract prepare(): void;
}

export default GameObject;
