<template>
  <div class="Avatar" :aria-label="name" role="img">
    <span aria-hidden="true" v-text="letters" />
  </div>
</template>

<script>
  export default {
    props: {
      name: { type: String, required: true }
    },

    computed: {
      /**
       * Transform the name param to avatar letters. e.g.:
       * "Lisa W" => "LW", "Max Frank Bauer" => "MF", "john.deer@mail.com" => "JD", "Nick" => "N"
       */
      letters() {
        let name = this.name.trim(),
            splitter = name.includes('.') ? '.' : ' '

        return name.split(splitter)
          .map(str => str.substr(0, 1))
          .join('')
          .substr(0, 2)
      }
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
    
    span {
      font-size: 0.6875em;
      font-weight: bold;
      text-transform: uppercase;
    }
  }
</style>