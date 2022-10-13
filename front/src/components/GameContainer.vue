<template>
  <div ref="gameContainer"></div>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, watch, onBeforeUnmount,
} from 'vue';
import GameEngine from '@/engine/GameEngine';
import { useStore } from 'vuex';
import api from 'api';

export default defineComponent({
  name: 'GameContainer',
  props: {
    isGameStart: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const gameContainer = ref<HTMLDivElement | null>(null);
    const store = useStore();
    let gameEngine: GameEngine;

    const gameReady = () => {
      if (!store.state.isAssetsLoad) {
        store.commit('loadAssets');
      }
      emit('gameReady');
    };

    const incrementCounter = () => {
      store.commit('incrementCounter');
    };

    const showPopUpGreat = () => {
      emit('showPopUpGreat');
    };

    const gameOver = async () => {
      const url = new URL(window.location.href);
      const playerId = url.searchParams.get('id') ?? '0';

      try {
        await api.getLocation(store.state.counter, playerId);
      } catch (e) {
        console.error(e);
      }

      emit('gameOver');
    };

    onMounted(async () => {
      if (gameContainer.value) {
        gameEngine = new GameEngine(
          gameContainer.value,
          store.state.isAssetsLoad,
        );

        await gameEngine.createGame();

        gameReady();

        gameEngine.app?.view.addEventListener('gameReady', gameReady);

        gameEngine.app?.view.addEventListener('incrementCounter', incrementCounter);

        gameEngine.app?.view.addEventListener('showPopUpGreat', showPopUpGreat);

        gameEngine.app?.view.addEventListener('gameOver', gameOver);
      }
    });

    onBeforeUnmount(async () => {
      gameEngine.app?.view.removeEventListener('gameReady', gameReady);

      gameEngine.app?.view.removeEventListener('incrementCounter', incrementCounter);

      gameEngine.app?.view.removeEventListener('showPopUpGreat', showPopUpGreat);

      gameEngine.app?.view.removeEventListener('gameOver', gameOver);

      gameEngine.app?.destroy();
    });

    watch(() => props.isGameStart, async () => {
      if (props.isGameStart) {
        await gameEngine.runGame();
      }
    });

    return {
      gameContainer,
    };
  },
});
</script>
