/* eslint-disable import/no-cycle */
import GameEngineInterface from '@/types/GameEngineInterface';
import GameEventsEnum from '@/constants/GameEventsEnum';

type events = {
  [key: string]: Event,
};

class GameEventsManager {
  private static instance: GameEventsManager = new GameEventsManager();

  private events: events = {};

  private engine?: GameEngineInterface;

  private constructor() {
    GameEventsManager.instance = this;
  }

  private createEvent(name: string) {
    const event = new Event(name);
    this.events[name] = event;
  }

  public static getInstance() {
    return GameEventsManager.instance;
  }

  public prepare(engine: GameEngineInterface) {
    this.engine = engine;

    Object.keys(GameEventsEnum).forEach((name) => {
      this.createEvent(name);
    });
  }

  public dispatchEvent(name: GameEventsEnum) {
    this.engine?.app?.view.dispatchEvent(this.events[name]);
  }
}

export default GameEventsManager;
