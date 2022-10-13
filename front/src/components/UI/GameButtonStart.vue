<template>
  <button
    class="select-tower-game-button-start"
    @click="buttonHandler"
  >
    {{ GameButtonStartText.button }}
  </button>
</template>

<script lang="ts">
import { GameButtonStartText } from '@/constants/GameTextsEnum';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameButtonStart',
  setup(_, { emit }) {
    const buttonHandler = () => {
      emit('startGame');
    };

    return {
      GameButtonStartText,
      buttonHandler,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../css/colors";

.select-tower-game-button-start {
  font-family: Inter, sans-serif;
  cursor: pointer;
  outline: none;
  padding: 10px 25px;
  border-radius: 14px;
  background: $button-start-background-color;
  border: 5px solid $button-start-border-color;
  color: $button-start-text-color;
  letter-spacing: 0.06em;
  font-weight: 900;
  font-size: 26px;
  user-select: none;

  @media (max-width: 791px) {
    border-radius: 8px;
    border: 3px solid $button-start-border-color;
  }
}
</style>
