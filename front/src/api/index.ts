import axios from 'axios';

export default {
  getLocation(distance: number, id: string) {
    return axios
      .get(`https://t-rex-game.ru/highscore/${distance}/?id=${id}`);
  },
};
