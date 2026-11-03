<script setup lang="ts">
import { useInstallPrompt } from '@/composables/useInstallPrompt';
import { Link } from '@inertiajs/vue3';
import { ChevronRight, Download, Smartphone } from '@lucide/vue';
import { computed } from 'vue';

interface Props {
    fullWidth?: boolean;
    label?: string;
}

const props = withDefaults(defineProps<Props>(), {
    fullWidth: false,
    label: 'Get the app',
});

const { canInstall, canPromptNatively, isMobileDevice, promptInstall } = useInstallPrompt();

const subtitle = computed(() => (canPromptNatively.value ? 'Install in one tap' : 'See how to install'));

const icon = computed(() => (isMobileDevice.value ? Smartphone : Download));

// Native prompt installs directly, every other browser goes to the install guide
const component = computed(() => (canPromptNatively.value ? 'button' : Link));

const attributes = computed(() => (canPromptNatively.value ? { type: 'button' } : { href: '/install' }));

const handleClick = (event: MouseEvent) => {
    if (!canPromptNatively.value) {
        return;
    }

    event.preventDefault();
    promptInstall();
};
</script>

<template>
    <component
        :is="component"
        v-if="canInstall"
        v-bind="attributes"
        :title="props.label"
        class="group text-primary-content transition"
        :class="
            props.fullWidth
                ? 'flex w-full items-center gap-3 rounded-xl border border-border-color bg-component-background p-2 text-left hover:border-primary'
                : 'inline-flex items-center gap-2 rounded-full border border-border-color px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary'
        "
        @click="handleClick"
    >
        <span
            v-if="props.fullWidth"
            class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-button-content"
        >
            <component :is="icon" class="size-4" />
        </span>
        <component :is="icon" v-else class="size-4" />

        <span v-if="props.fullWidth" class="flex min-w-0 flex-1 flex-col">
            <span class="truncate text-sm font-semibold">{{ props.label }}</span>
            <span class="truncate text-xs text-muted-content">{{ subtitle }}</span>
        </span>
        <span v-else class="hidden sm:inline">{{ props.label }}</span>

        <ChevronRight v-if="props.fullWidth" class="size-4 shrink-0 text-muted-content transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </component>
</template>
