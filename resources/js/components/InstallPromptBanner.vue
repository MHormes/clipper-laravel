<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { useConsent } from '@/composables/useConsent';
import { useInstallPrompt } from '@/composables/useInstallPrompt';
import { Link, usePage } from '@inertiajs/vue3';
import { X } from '@lucide/vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const VISITS_KEY = 'install_prompt_visits';
const SESSION_KEY = 'install_prompt_session_counted';

// Delay before the banner slides in, so it never interrupts the first glance at a page
const SHOW_DELAY_MS = 4000;

// Only returning visitors see the banner, first-time visitors are left alone
const MIN_VISITS = 2;

const { shouldShowPopup, canPromptNatively, promptInstall, dismiss } = useInstallPrompt();
const { hasDecided } = useConsent();
const page = usePage<{ auth: { user: unknown | null } }>();

const isReady = ref(false);
const isReturningVisitor = ref(false);

let showTimer: ReturnType<typeof setTimeout> | undefined;

// Only logged-in users are asked, visitors still deciding on an account are left alone
const isLoggedIn = computed(() => Boolean(page.props.auth?.user));

const isOnInstallPage = computed(() => (page.url ?? '').split('?')[0] === '/install');

const isVisible = computed(
    () => isReady.value && isReturningVisitor.value && isLoggedIn.value && shouldShowPopup.value && hasDecided.value && !isOnInstallPage.value,
);

function countVisit(): number {
    try {
        const stored = Number(window.localStorage.getItem(VISITS_KEY) ?? '0');

        if (window.sessionStorage.getItem(SESSION_KEY)) {
            return stored;
        }

        window.sessionStorage.setItem(SESSION_KEY, '1');
        window.localStorage.setItem(VISITS_KEY, String(stored + 1));

        return stored + 1;
    } catch {
        return 0;
    }
}

const install = async () => {
    await promptInstall();
    dismiss();
};

onMounted(() => {
    isReturningVisitor.value = countVisit() >= MIN_VISITS;

    showTimer = setTimeout(() => {
        isReady.value = true;
    }, SHOW_DELAY_MS);
});

onBeforeUnmount(() => {
    clearTimeout(showTimer);
});
</script>

<template>
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-full opacity-0"
    >
        <div
            v-if="isVisible"
            class="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
            role="dialog"
            aria-live="polite"
            aria-label="Install Clipper-MS"
        >
            <div class="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-border-color bg-component-background p-3 shadow-2xl">
                <AppLogoIcon class="size-12 shrink-0" />

                <div class="min-w-0 flex-1">
                    <p class="text-sm font-bold text-primary-content">Get the Clipper-MS app</p>
                    <p class="text-xs leading-snug text-muted-content">Full screen and one tap away on your Home Screen.</p>
                </div>

                <button
                    v-if="canPromptNatively"
                    type="button"
                    class="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-button-content transition hover:opacity-90"
                    @click="install"
                >
                    Install
                </button>
                <Link
                    v-else
                    href="/install"
                    class="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-button-content transition hover:opacity-90"
                    @click="dismiss"
                >
                    Show me
                </Link>

                <button
                    type="button"
                    class="shrink-0 rounded-full p-1.5 text-muted-content transition hover:bg-muted-background hover:text-primary-content"
                    aria-label="Dismiss"
                    @click="dismiss"
                >
                    <X class="size-4" />
                </button>
            </div>
        </div>
    </Transition>
</template>
