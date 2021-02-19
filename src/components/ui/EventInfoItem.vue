<template>
  <li class="EventInfoItem" :class="{ isTruncated }">
    <Avatar
      v-if="isOrganizerObj"
      class="EventInfoItem-avatar"
      :name="item.emailAddress.name"
    />

    <Icon 
      v-if="icon" 
      class="EventInfoItem-icon"
      :name="icon" 
    />

    <component 
      :is="isLink ? 'a' : 'span'"
      :href="isLink && item._redirectTo"
      :rel="isLink && 'noopener'"
      :target="isLink && '_blank'"
      :title="label">

      {{ label }}
      <Icon v-if="isLink" name="top-right" />
    </component>

    <span
      v-if="secondaryLabel"
      v-text="`— ${ secondaryLabel }`" 
      :title="secondaryTitle"
      class="EventInfoItem-secondary"
    />
  </li>
</template>

<script>
  import { computed } from 'vue'

  import Icon from '@/components/ui/Icon'
  import Avatar from '@/components/ui/Avatar'

  export default {
    props: {
      item:         { type: [ Object, String ], required: true },
      secondary:    { type: [ Object, String ], default: null },
      isTruncated:  { type: Boolean, default: false },
      icon:         { type: String, default: null, validator: val => val.length }
    },

    components: { Icon, Avatar },

    setup: props => {
      /**
       * "item" prop
       */
      const isLocationObj   = computed(() => props.item?._text),
            isOrganizerObj  = computed(() => props.item?.emailAddress),
            isLink          = computed(() => isLocationObj.value && props.item?._redirectTo)

      const label = computed(() => {
        if (isLocationObj.value) return props.item._text
        if (isOrganizerObj.value) return props.item.emailAddress.name
        return props.item
      })


      /**
       * "secondary" prop
       */
      const secondaryIsAttendeesArr = computed(() => Array.isArray(props.secondary) && props.secondary?.[0]?.emailAddress)

      const secondaryLabel = computed(() => {
        if (!props.secondary?.length) return null
        if (!secondaryIsAttendeesArr.value) return props.secondary
        let attendeesAmount = props.secondary.length
        return attendeesAmount > 1 ? `${ attendeesAmount} Teilnehmer` : ''
      })

      const secondaryTitle = computed(() => {
        if (!secondaryIsAttendeesArr.value) return null
        return props.secondary.map(person => person.emailAddress.name).join('; ')
      })
      

      return { 
        isLocationObj, isOrganizerObj, isLink, label,
        secondaryLabel, secondaryTitle
      }
    }
  }
</script>

<style lang="scss" scoped>
  .EventInfoItem {
    display: flex;

    &:not(.isTruncated) &-secondary {
      white-space: nowrap;
    }

    &.isTruncated span {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    &-icon, &-secondary {
      color: var(--color-content-tertiary);
    }

    &-secondary {
      display: block;
      margin-left: .375rem;
    }

    &-icon, &-avatar {
      flex-shrink: 0;
      margin: .125rem calc(.5rem - 1px) 0 -1px;
    }

    &-icon {
      height: 1rem;
      width: 1rem;
    }

    &-avatar {
      font-size: 1rem;
    }

    a {
      display: inline-flex;
      flex-shrink: 0;
      position: relative;

      svg {
        opacity: .5;
        height: 1.75ch;
        width: 1.75ch;
        margin-left: .25ch;
        transition: transform 150ms ease;
      }

      &:hover svg {
        transform: translate(.125rem, -.125rem);
      }
    }
  }
</style>
