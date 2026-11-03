<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { OTPInputEmits, OTPInputProps } from "vue-input-otp"
import { reactiveOmit } from "@vueuse/core"
import { useForwardPropsEmits } from "reka-ui"
import { OTPInput } from "vue-input-otp"
import { cn } from "@/lib/utils"

const props = defineProps<OTPInputProps & { class?: HTMLAttributes["class"] }>()
const emits = defineEmits<OTPInputEmits>()

const delegatedProps = reactiveOmit(props, "class")
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<script lang="ts">
import { h, computed } from "vue"
import { useForwardProps, useForwardPropsEmits as useRekaForwardPropsEmits } from "reka-ui"
import { MinusIcon } from "@lucide/vue"
import { useVueOTPContext } from "vue-input-otp"

export const InputOTPGroup = {
  name: 'InputOTPGroup',
  props: { class: { type: null, required: false } },
  setup(props: any, { slots }: any) {
    const delegatedProps = reactiveOmit(props, "class")
    const forwarded = useForwardProps(delegatedProps)
    return () => h('div', { 'data-slot': 'input-otp-group', ...forwarded, class: cn('flex items-center', props.class) }, slots)
  }
}

export const InputOTPSeparator = {
  name: 'InputOTPSeparator',
  setup(props: any, { slots }: any) {
    const forwarded = useForwardProps(props)
    return () => h('div', { 'data-slot': 'input-otp-separator', role: 'separator', ...forwarded }, slots.default ? slots.default() : [h(MinusIcon)])
  }
}

export const InputOTPSlot = {
  name: 'InputOTPSlot',
  // Props must be declared, otherwise index lands in attrs and the slot never shows its digit
  props: {
    index: { type: Number, required: true },
    class: { type: null, required: false },
  },
  setup(props: any) {
    const delegatedProps = reactiveOmit(props, "class")
    const forwarded = useForwardProps(delegatedProps)
    const context = useVueOTPContext()
    const slot = computed(() => context?.value.slots[props.index])

    return () => h('div', {
      'data-slot': 'input-otp-slot',
      'data-active': slot.value?.isActive,
      ...forwarded,
      class: cn('data-[active=true]:border-primary-content data-[active=true]:ring-primary-content/50 data-[active=true]:aria-invalid:ring-error/30 aria-invalid:border-error data-[active=true]:aria-invalid:border-error bg-input-background text-primary-content border-border-color relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]', props.class)
    }, [
      slot.value?.char,
      slot.value?.hasFakeCaret && h('div', { class: 'pointer-events-none absolute inset-0 flex items-center justify-center' }, [
        h('div', { class: 'animate-caret-blink bg-primary-content h-4 w-px duration-1000' })
      ])
    ])
  }
}
</script>

<template>
  <OTPInput
    v-slot="slotProps"
    v-bind="forwarded"
    :container-class="cn('flex items-center gap-2 has-disabled:opacity-50', props.class)"
    data-slot="input-otp"
    class="disabled:cursor-not-allowed"
  >
    <slot v-bind="slotProps" />
  </OTPInput>
</template>
