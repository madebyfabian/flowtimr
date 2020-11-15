<template>
  <div class="Avatar" :aria-label="name" role="img">
    <span aria-hidden="true" v-text="letters" />
  </div>
</template>

<script>
  import { computed } from 'vue'

  export default {
    props: {
      name: { type: String, required: true }
    },

    setup( props ) {
      /**
       * Transform the name param to avatar letters. e.g.:
       * "Lisa W" => "LW", "Max Frank Bauer" => "MF", "john.deer@mail.com" => "JD", "Nick" => "N"
       */
      const letters = computed(() => {
        let name = props.name.trim(),
            splitter = name.includes('.') ? '.' : ' '

        return name.split(splitter)
          .map(str => str.substr(0, 1))
          .join('')
          .substr(0, 2)
      })
      
      return { letters } 
    }
  }
</script>

<style lang="scss" scoped>
  .Avatar {
    height: 1em;
    width: 1em;
    border-radius: .25em;
    box-shadow: 0 0 0 .09375em var(--color-content-tertiary);
    background: var(--color-bg-tertiary);
    color: var(--color-content-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    flex-shrink: 0;
    
    span {
      font-size: 0.625em;
      font-weight: bold;
      text-transform: uppercase;
    }
  }
</style>