<template>
  <div class="select-tower-game-pop-up-great">
    <div class="select-tower-game-pop-up-great__title">
      {{ GamePopUpGreatText.title }}
    </div>
    <div
      class="select-tower-game-pop-up-great__description"
      v-html="`${GamePopUpGreatText.description1}${score}${GamePopUpGreatText.description2}`"
    >
    </div>
  </div>
</template>

<script lang="ts">
import { GamePopUpGreatText } from '@/constants/GameTextsEnum';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GamePopUpGreat',
  props: {
    score: {
      type: Number,
      default: 100,
    },
  },
  setup() {
    return {
      GamePopUpGreatText,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../css/colors";

.select-tower-game-pop-up-great {
  max-width: 465px;
  padding: 7px 15px;
  background:
    linear-gradient(
      109.33deg,
      $pop-up-great-gradient-light-color 0.04%,
      $pop-up-great-gradient-dark-color 118.23%
    );
  border-radius: 21px;
  pointer-events: none;
  user-select: none;
  text-align: left;
  box-sizing: border-box;

  @media (max-width: 791px) {
    max-width: 104px;
    padding: 4px 12px;
    border-radius: 11px;
  }

  &__title {
    font-weight: 700;
    font-size: 20px;
    color: $pop-up-great-text-color;
    margin-bottom: 4px;

    @media (max-width: 791px) {
      margin-bottom: 1px;
      font-size: 17px;
    }
  }

  &__description {
    font-weight: 500;
    font-size: 18px;
    color: $pop-up-great-text-color;

    @media (max-width: 791px) {
      font-size: 12px;
    }
  }
}
</style>
