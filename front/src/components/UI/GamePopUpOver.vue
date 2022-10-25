<template>
  <div class="select-tower-game-pop-up-over">
    <div class="select-tower-game-pop-up-over__title">{{ GamePopUpOverText.title }}</div>
    <div class="select-tower-game-pop-up-over__description">
      {{ filteredDescription }}
    </div>
    <game-button-again-vue
      class="select-tower-game-pop-up-over__button"
      @click="buttonAgainHandler"
    />
  </div>
</template>

<script lang="ts">
import { GamePopUpOverText } from '@/constants/GameTextsEnum';
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import declineWord from '@/helpers/utils';
import GameButtonAgainVue from './GameButtonAgain.vue';

export default defineComponent({
  name: 'GamePopUpOver',
  components: {
    GameButtonAgainVue,
  },
  setup(_, { emit }) {
    const store = useStore();

    const buttonAgainHandler = () => {
      emit('buttonAgainHandler');
    };

    const filteredDescription = computed(() => {
      const counter = declineWord(store.state.counter, ['очко', 'очка', 'очков']);
      return `${GamePopUpOverText.description1}${counter}${GamePopUpOverText.description2}`;
    });

    return {
      GamePopUpOverText,
      store,
      filteredDescription,
      buttonAgainHandler,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../css/colors";

.select-tower-game-pop-up-over {
  padding: 14px 23px;
  background: $pop-up-over-background-color;
  border: 4px solid $pop-up-over-border-color;
  border-radius: 13px;
  width: 100%;
  max-width: 324px;
  pointer-events: none;
  user-select: none;
  text-align: left;

  @media (max-width: 791px) {
    padding: 20px 17px;
    border: 3px solid $pop-up-over-border-color;
    border-radius: 8px;
  }

  &__title {
    font-weight: 900;
    font-size: 22px;
    line-height: 146.02%;
    letter-spacing: 0.02em;
    color: $pop-up-over-text-color;
    margin-bottom: 8px;

    @media (max-width: 791px) {
      font-size: 20px;
      margin-bottom: 8px;
    }
  }

  &__description {
    font-weight: 500;
    font-size: 20px;
    line-height: 146.02%;
    letter-spacing: 0.02em;
    color: $pop-up-over-text-color;
    margin-bottom: 13px;
    text-align: left;

    @media (max-width: 791px) {
      font-size: 18px;
    }
  }

  &__button {
    pointer-events: all;
  }
}
</style>
