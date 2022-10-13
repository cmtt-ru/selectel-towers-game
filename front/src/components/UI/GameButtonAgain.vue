<template>
  <button
    class="select-tower-game-button-again"
    @click="buttonHandler"
  >
    <svg class="select-tower-game-button-again__icon" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.314 9.66c-6.08-1.628-12.329 1.98-13.957 8.06-1.63 6.079 1.978 12.327 8.058 13.956 6.08 1.63 12.328-1.978 13.957-8.058a1.753 1.753 0 0 1 3.387.908c-2.13 7.95-10.302 12.668-18.252 10.537C3.557 32.933-1.16 24.762.97 16.811 3.1 8.861 11.27 4.144 19.22 6.274a1.753 1.753 0 1 1-.907 3.387Z" fill="#104CA5"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.634 1.02a1.753 1.753 0 0 1 2.48 0l6.198 6.199a1.753 1.753 0 0 1 0 2.48l-6.199 6.198a1.753 1.753 0 1 1-2.48-2.48l4.96-4.959-4.96-4.959a1.753 1.753 0 0 1 0-2.479Z" fill="#104CA5"/></svg>
    <span class="select-tower-game-button-again__text">{{ GameButtonAgainText.button }}</span>
  </button>
</template>

<script lang="ts">
import { GameButtonAgainText } from '@/constants/GameTextsEnum';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameButtonAgain',
  emits: ['click'],
  setup(_, { emit }) {
    const buttonHandler = () => {
      emit('click');
    };

    return {
      GameButtonAgainText,
      buttonHandler,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../css/colors";

.select-tower-game-button-again {
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  outline: none;
  cursor: pointer;
  font-family: Inter, sans-serif;
  padding: 0;
  margin: 0;

  &__icon {
    width: 15px;
    height: 18px;
    fill: $main-icon-color;
    transition: transform 0.5s ease;
    transform-origin: 50% 55%;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover &__icon {
      transform: rotate(360deg);
    }
  }

  &__text {
    font-weight: 400;
    font-size: 18px;
    line-height: 33px;
    color: $button-again-text-color;
    margin-left: 9px;
  }
}
</style>
