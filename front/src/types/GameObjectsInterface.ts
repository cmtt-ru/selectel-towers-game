import GameBackground from '@/engine/gameObjects/GameBackground';
import GameCrane from '@/engine/gameObjects/GameCrane';
import GameDino from '@/engine/gameObjects/GameDino';
import GameServerStack from '@/engine/gameObjects/GameServerStack';
import GameServer from '@/engine/gameObjects/GameServer';

interface GameObjectsInterface {
  // background: GameBackground,
  // crane: GameCrane,
  // dino: GameDino,
  // gameServerStack: GameServerStack,
  // server: GameServer,
  [key: string]: GameBackground
    | GameCrane
    | GameDino
    | GameServerStack
    | GameServer
}

export default GameObjectsInterface;
