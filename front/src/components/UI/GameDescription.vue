<template>
  <div
    class="select-tower-game-start-description"
  >
    <div class="select-tower-game-start-description__text">{{ currentText }}</div>
  </div>
</template>

<script lang="ts">
import { GameDescriptionText } from '@/constants/GameTextsEnum';
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'GameDescription',
  setup() {
    const texts = {
      desktop: GameDescriptionText.desktop,
      mobile: GameDescriptionText.mobile,
    };
    const currentText = ref('');

    onMounted(() => {
      const isTouch = window.matchMedia('(hover: none)').matches;
      currentText.value = texts[isTouch ? 'mobile' : 'desktop'];
    });

    return {
      currentText,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../css/colors";

.select-tower-game-start-description {
  width: 100%;
  text-align: center;
  font-weight: 500;
  font-size: 20px;
  line-height: 26px;
  color: $description-text-color;
  pointer-events: none;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 95px;

  &__text {
    max-width: 800px;
  }

  @media (max-width: 791px) {
    width: calc(100% - 84px);
    font-size: 18px;
    line-height: 135%;
    height: 162px;
  }
}
</style>
