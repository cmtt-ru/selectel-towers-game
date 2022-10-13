<template>
  <div class="select-tower-game__counter">{{ filteredCounter }}</div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'GameCounter',
  props: {
    counter: {
      type: String,
      default: '243',
    },
  },
  setup() {
    const store = useStore();
    const maxCounterLength = 5;

    const filteredCounter = computed(() => {
      const counterLength = store.state.counter.length;
      const counterOfRepeatZero = maxCounterLength - counterLength;

      return '0'.repeat(counterOfRepeatZero >= 0 ? counterOfRepeatZero : 0) + store.state.counter;
    });

    return {
      filteredCounter,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../css/colors";

.select-tower-game__counter {
  font-weight: 900;
  font-size: 29px;
  letter-spacing: 0.1em;
  color: $counter-text-color;
  text-shadow: 0 2.5px 0 $counter-shadow-light-color, 0 -2.5px 0 $counter-shadow-dark-color;
  pointer-events: none;
  user-select: none;

  @media (max-width: 791px) {
    font-size: 24px;
    text-shadow: 0 1.5px 0 $counter-shadow-light-color, 0 -1px 0 $counter-shadow-dark-color;
  }
}
</style>
