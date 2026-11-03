<script lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

// Clipper button standard: every variant has a visible hover change and only uses theme tokens.
// The pointer cursor is applied globally in resources/css/app.css.
export const appButtonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary: 'bg-primary text-button-content shadow-lg shadow-primary/20 hover:brightness-90',
                secondary: 'bg-muted-background text-primary-content hover:bg-primary hover:text-button-content',
                outline: 'border border-border-color bg-component-background text-primary-content hover:border-primary/50 hover:text-primary',
                'outline-primary': 'border border-primary/20 text-primary hover:bg-primary hover:text-button-content',
                ghost: 'text-muted-content hover:bg-muted-background hover:text-primary-content',
                'ghost-danger': 'text-muted-content hover:bg-error/10 hover:text-error',
                danger: 'bg-error text-button-content hover:brightness-90',
                'danger-soft': 'bg-error/10 text-error hover:bg-error hover:text-button-content',
            },
            size: {
                sm: 'h-8 px-3 text-xs [&_svg]:size-3.5',
                md: 'h-10 px-6 text-sm [&_svg]:size-4',
                lg: 'h-12 px-8 text-lg [&_svg]:size-5',
                icon: 'size-10 [&_svg]:size-4',
            },
            pill: {
                true: 'rounded-full',
                false: 'rounded-xl',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
            pill: false,
        },
    },
);

export type AppButtonVariants = VariantProps<typeof appButtonVariants>;
</script>

<script setup lang="ts">
import Spinner from '@/components/ui/Spinner.vue';
import { cn } from '@/lib/utils';
import { Link, type InertiaLinkProps } from '@inertiajs/vue3';
import { computed, type HTMLAttributes } from 'vue';

const props = withDefaults(
    defineProps<{
        variant?: AppButtonVariants['variant'];
        size?: AppButtonVariants['size'];
        pill?: boolean;
        href?: NonNullable<InertiaLinkProps['href']>;
        loading?: boolean;
        disabled?: boolean;
        class?: HTMLAttributes['class'];
    }>(),
    {
        variant: 'primary',
        size: 'md',
        pill: false,
        href: undefined,
        loading: false,
        disabled: false,
        class: undefined,
    },
);

const classes = computed(() => cn(appButtonVariants({ variant: props.variant, size: props.size, pill: props.pill }), props.class));
</script>

<template>
    <!-- With an href the button renders as an Inertia Link; otherwise a native button (type defaults to the browser default) -->
    <Link v-if="href" :href="href" data-slot="app-button" :class="classes">
        <slot />
    </Link>
    <button v-else data-slot="app-button" :class="classes" :disabled="disabled || loading" :aria-busy="loading || undefined">
        <Spinner v-if="loading" />
        <slot />
    </button>
</template>
