<template>
  <div class="special-tower-game">
    <game-container-vue
      :isGameStart="isGameStart"
      :key="repeatGameCounter"
      @gameReady="gameReady"
      @showPopUpGreat="showPopUpGreat"
      @gameOver="gameOver"
    />
    <game-button-start-vue
      v-if="isShow.startButton"
      class="select-tower-game-button-start"
      @startGame="startGame"
    />
    <game-description-vue
      v-if="isShow.description"
      class="select-tower-game-start-description"
    />
    <game-counter-vue
      v-if="isShow.counter"
      class="select-tower-game__counter"
    />
    <game-pop-up-great-vue
      v-if="isShow.great"
      class="select-tower-game-pop-up-great"
    />
    <game-pop-up-over-vue
      v-if="isShow.over"
      class="select-tower-game-pop-up-over"
      @buttonAgainHandler="buttonAgainHandler"
    />
    <game-turn-you-screen />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import GameContainerVue from './components/GameContainer.vue';
import GameButtonStartVue from './components/UI/GameButtonStart.vue';
import GamePopUpGreatVue from './components/UI/GamePopUpGreat.vue';
import GameDescriptionVue from './components/UI/GameDescription.vue';
import GameCounterVue from './components/UI/GameCounter.vue';
import GamePopUpOverVue from './components/UI/GamePopUpOver.vue';
import GameTurnYouScreen from './components/UI/GameTurnYouScreen.vue';

export default defineComponent({
  name: 'App',
  components: {
    GameContainerVue,
    GamePopUpGreatVue,
    GameButtonStartVue,
    GameDescriptionVue,
    GameCounterVue,
    GamePopUpOverVue,
    GameTurnYouScreen,
  },
  setup() {
    const store = useStore();

    let isFirstGameLaunch = true;

    const isShow = ref({
      startButton: false,
      description: true,
      counter: false,
      great: false,
      over: false,
    });

    const repeatGameCounter = ref(0);

    const isGameStart = ref(false);

    const gameReady = () => {
      if (isFirstGameLaunch) {
        isShow.value.startButton = true;
        isFirstGameLaunch = false;
      }
    };

    const startGame = () => {
      isShow.value.startButton = false;
      isShow.value.description = false;
      isShow.value.counter = true;
      isGameStart.value = true;
    };

    const showPopUpGreat = () => {
      isShow.value.great = true;

      setTimeout(() => {
        isShow.value.great = false;
      }, 5000);
    };

    const gameOver = () => {
      isShow.value.over = true;
      isGameStart.value = false;
    };

    const buttonAgainHandler = () => {
      isShow.value.over = false;
      store.commit('cleanCounter');
      repeatGameCounter.value += 1;

      setTimeout(() => {
        isGameStart.value = true;
      }, 100);
    };

    return {
      isShow,
      isGameStart,
      repeatGameCounter,
      gameReady,
      startGame,
      showPopUpGreat,
      gameOver,
      buttonAgainHandler,
    };
  },
});
</script>

<style lang="scss">
@import "https://fonts.googleapis.com/css2?family=Fira+Code:wght@500;700&family=Inter:wght@400;500;700;900&display=swap";
@import "./css/colors";

#app {
  position: relative;
  font-family: Inter, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $main-text-color;
  max-height: 100vh;
  overflow: hidden;
}

.select-tower-game {
  &-pop-up {
    &-great {
      position: absolute;
      top: 25px;
      right: 58px;

      @media (max-width: 791px) {
        top: 20px;
        right: 11px;
      }
    }

    &-over {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &-button-start {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    bottom: 210px;

    @media (max-width: 791px) {
      bottom: 50%;
      transform: translate(-50%, 50%);
    }
  }

  &-start-description {
    position: absolute;
    bottom: 0;

    @media (max-width: 791px) {
      margin: 0 42px;
    }
  }

  &__counter {
    position: absolute;
    top: 39px;
    left: 50px;

    @media (max-width: 791px) {
      left: 13px;
      top: 21px;
    }
  }
}
</style>
