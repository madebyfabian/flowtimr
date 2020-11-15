<template>
  <ul class="EventInfoBar copy">
    <li v-for="(item, key) of filteredItems" :key="key">
      <EventInfoItem :item="item" />
      <span class="EventInfoBar-seperator" v-if="key + 1 !== filteredItems.length" v-text="'–'" />
    </li>
  </ul>
</template>

<script>
  import { computed } from 'vue'

  import EventInfoItem from '@/components/ui/EventInfoItem' 

  export default {
    props: {
      items: { type: Array, required: true }
    },

    components: { EventInfoItem },

    setup( props ) {
      const valueIsLocationObj = val => typeof val === 'object' && '_text' in val

      const filteredItems = computed(() => props.items.filter(item => {
        return !valueIsLocationObj(item) ? item : item && item._text?.length
      }))

      return { filteredItems }
    }
  }
</script>

<style lang="scss" scoped>
  .EventInfoBar {
    word-break: break-word;
    display: inline-flex;
    flex-wrap: wrap;

    &-seperator {
      margin: 0 .66ch;
      display: inline-block;
    }
  }
</style>