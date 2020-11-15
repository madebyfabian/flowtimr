<template>
  <ul class="EventInfoBar copy">
    <li v-for="(item, key) of filteredItems" :key="key">
      <EventInfoItem :item="item" />
      <span class="EventInfoBar-seperator" v-if="key + 1 !== filteredItems.length" v-text="'–'" />
    </li>

    <pre style="display: none">
      {{filteredItems}}
      {{items.length}}
    </pre>
  </ul>
</template>

<script>
  import EventInfoItem from '@/components/ui/EventInfoItem' 

  export default {
    props: {
      items: { type: Array, required: true }
    },

    components: { EventInfoItem },

    computed: {
      filteredItems() {
        return this.items.filter(item => {
          if (this.valueIsLocationObj(item))
            return !!item && item._text && item._text.length
          else
            return !!item
        }) 
      }
    },
    
    methods: {
      valueIsLocationObj( val ) {
        return typeof val === 'object' && '_text' in val
      }
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