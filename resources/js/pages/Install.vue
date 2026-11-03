<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import AppButton from '@/components/AppButton.vue';
import { useInstallPrompt, type InstallPlatform } from '@/composables/useInstallPrompt';
import { Head, Link } from '@inertiajs/vue3';
import {
    AppWindow,
    CircleCheck,
    Download,
    Ellipsis,
    EllipsisVertical,
    ExternalLink,
    Info,
    Maximize,
    Menu,
    Monitor,
    Pin,
    RefreshCw,
    Share,
    ShieldCheck,
    Smartphone,
    SquarePlus,
    Zap,
} from '@lucide/vue';
import { computed, ref, watch, type Component } from 'vue';

type GroupId = 'ios' | 'android' | 'computer' | 'in-app';

interface InstallStep {
    icon: Component;
    text: string;
}

interface InstallGuide {
    id: string;
    browser: string;
    steps: InstallStep[];
    note?: string;
}

interface GuideGroup {
    id: GroupId;
    label: string;
    icon: Component;
    intro: string;
    guides: InstallGuide[];
}

const { platform, isInstalled, canPromptNatively, promptInstall } = useInstallPrompt();

const groups: GuideGroup[] = [
    {
        id: 'ios',
        label: 'iPhone & iPad',
        icon: Smartphone,
        intro: 'On iOS 16.4 and newer you can add Clipper-MS to your Home Screen from any browser: Safari, Chrome, Edge or Firefox.',
        guides: [
            {
                id: 'ios-safari',
                browser: 'Safari',
                steps: [
                    { icon: Share, text: 'Tap the Share button. On newer iOS versions it sits behind the “⋯” button next to the address bar.' },
                    { icon: SquarePlus, text: 'Scroll down and tap “Add to Home Screen”.' },
                    { icon: CircleCheck, text: 'Keep “Open as Web App” switched on and tap “Add”.' },
                ],
            },
            {
                id: 'ios-chrome',
                browser: 'Chrome, Edge & Firefox',
                steps: [
                    { icon: Share, text: 'Tap the Share button in the address bar, or open the menu and choose “Share”.' },
                    { icon: SquarePlus, text: 'Tap “Add to Home Screen”. You may need to tap “More” or scroll to find it.' },
                    { icon: CircleCheck, text: 'Tap “Add” to confirm.' },
                ],
                note: 'Option missing? Update iOS, or open this page in Safari.',
            },
        ],
    },
    {
        id: 'android',
        label: 'Android',
        icon: Smartphone,
        intro: 'Most Android browsers can install Clipper-MS as a real app with its own icon and no address bar.',
        guides: [
            {
                id: 'android-chrome',
                browser: 'Chrome',
                steps: [
                    { icon: EllipsisVertical, text: 'Tap the menu (⋮) in the top-right corner.' },
                    { icon: SquarePlus, text: 'Tap “Add to Home screen” and choose “Install”.' },
                    { icon: CircleCheck, text: 'Tap “Install” to confirm. The app appears in your app drawer.' },
                ],
            },
            {
                id: 'android-samsung',
                browser: 'Samsung Internet',
                steps: [
                    { icon: Menu, text: 'Tap the menu (☰) in the bottom-right corner.' },
                    { icon: SquarePlus, text: 'Tap “Add page to”, then “Home screen”.' },
                    { icon: CircleCheck, text: 'Tap “Add” to confirm.' },
                ],
            },
            {
                id: 'android-firefox',
                browser: 'Firefox',
                steps: [
                    { icon: EllipsisVertical, text: 'Tap the menu (⋮) next to the address bar.' },
                    { icon: SquarePlus, text: 'Tap “Add app to Home screen”.' },
                    { icon: CircleCheck, text: 'Confirm. It opens full screen, without the address bar.' },
                ],
            },
            {
                id: 'android-edge',
                browser: 'Edge',
                steps: [
                    { icon: Menu, text: 'Tap the menu (☰) at the bottom of the screen.' },
                    { icon: SquarePlus, text: 'Tap “Add to phone”.' },
                    { icon: CircleCheck, text: 'Tap “Install” to confirm.' },
                ],
            },
            {
                id: 'android-other',
                browser: 'Other browsers',
                steps: [
                    { icon: EllipsisVertical, text: 'Open the browser menu.' },
                    { icon: SquarePlus, text: 'Look for “Install app”, “Add to Home screen” or “Add to phone”.' },
                    { icon: CircleCheck, text: 'Confirm to place Clipper-MS on your Home screen.' },
                ],
                note: 'No option? Open this page in Chrome and try again.',
            },
        ],
    },
    {
        id: 'computer',
        label: 'Computer',
        icon: Monitor,
        intro: 'Clipper-MS also runs as a desktop app in its own window, pinned to your taskbar or Dock.',
        guides: [
            {
                id: 'desktop-chromium',
                browser: 'Chrome & Edge',
                steps: [
                    { icon: Download, text: 'Click the install icon on the right side of the address bar.' },
                    { icon: EllipsisVertical, text: 'No icon? Open the menu (⋮ or ⋯) and choose “Cast, save and share” → “Install page as app” (Chrome) or “Apps” → “Install this site as an app” (Edge).' },
                    { icon: CircleCheck, text: 'Click “Install” to confirm.' },
                ],
            },
            {
                id: 'desktop-safari',
                browser: 'Safari on Mac',
                steps: [
                    { icon: Share, text: 'Click the Share button in the toolbar, or open the “File” menu.' },
                    { icon: SquarePlus, text: 'Choose “Add to Dock”.' },
                    { icon: CircleCheck, text: 'Click “Add”. Requires macOS Sonoma or newer.' },
                ],
            },
            {
                id: 'desktop-firefox',
                browser: 'Firefox',
                steps: [
                    { icon: SquarePlus, text: 'Click the “Add tab to taskbar” icon on the right side of the address bar.' },
                    { icon: AppWindow, text: 'Clipper-MS opens in its own window, without the address bar, with its own taskbar icon.' },
                    { icon: Pin, text: 'Right-click that taskbar icon and choose “Pin to taskbar” to keep it there.' },
                ],
                note: 'Available on Windows with Firefox 143 or newer. On Mac or Linux, use Chrome, Edge or Safari instead.',
            },
        ],
    },
    {
        id: 'in-app',
        label: 'In-app browser',
        icon: ExternalLink,
        intro: 'Opened this link from Instagram, Facebook, WhatsApp or another app? Their built-in browser can’t install web apps.',
        guides: [
            {
                id: 'in-app',
                browser: 'Open in your real browser',
                steps: [
                    { icon: Ellipsis, text: 'Tap the menu (⋯ or ⋮) in a corner of the screen.' },
                    { icon: ExternalLink, text: 'Choose “Open in browser”, “Open in Safari” or “Open in Chrome”.' },
                    { icon: SquarePlus, text: 'Come back to this page there and follow the steps for your device.' },
                ],
            },
        ],
    },
];

const platformGuide: Record<InstallPlatform, { group: GroupId; guide: string }> = {
    ios: { group: 'ios', guide: '' },
    'android-chrome': { group: 'android', guide: 'android-chrome' },
    'android-samsung': { group: 'android', guide: 'android-samsung' },
    'android-firefox': { group: 'android', guide: 'android-firefox' },
    'android-edge': { group: 'android', guide: 'android-edge' },
    'android-other': { group: 'android', guide: 'android-other' },
    'in-app': { group: 'in-app', guide: 'in-app' },
    'desktop-chromium': { group: 'computer', guide: 'desktop-chromium' },
    'desktop-safari': { group: 'computer', guide: 'desktop-safari' },
    'desktop-firefox': { group: 'computer', guide: 'desktop-firefox' },
    'desktop-other': { group: 'computer', guide: '' },
};

const benefits = [
    { icon: Maximize, title: 'Full screen', text: 'No address bar or browser buttons in the way.' },
    { icon: Zap, title: 'One tap away', text: 'Launch straight from your Home Screen or taskbar.' },
    { icon: RefreshCw, title: 'Always up to date', text: 'Updates arrive automatically, no app store needed.' },
    { icon: ShieldCheck, title: 'Light & safe', text: 'Takes almost no storage and remove it any time.' },
];

const detected = computed(() => platformGuide[platform.value]);

const selectedGroup = ref<GroupId>(detected.value.group);

// Platform is detected client-side, so sync the selected tab once it is known
watch(
    () => detected.value.group,
    (group) => {
        selectedGroup.value = group;
    },
);

const activeGroup = computed(() => groups.find((group) => group.id === selectedGroup.value) ?? groups[0]);

const isDetectedGuide = (guide: InstallGuide) => {
    if (detected.value.group !== selectedGroup.value) {
        return false;
    }

    // iOS steps are the same idea in every browser, so highlight Safari unless another browser is open
    if (platform.value === 'ios') {
        return guide.id === (/CriOS|FxiOS|EdgiOS/i.test(window.navigator.userAgent) ? 'ios-chrome' : 'ios-safari');
    }

    return guide.id === detected.value.guide;
};
</script>

<template>
    <Head title="Install the App">
        <meta
            name="description"
            content="Install Clipper-MS on your iPhone, iPad, Android phone or computer. Step-by-step guides for Safari, Chrome, Firefox, Samsung Internet and Edge."
        />
    </Head>

    <div class="min-h-screen bg-primary-background text-primary-content">
        <nav class="border-b border-border-color">
            <div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
                <Link href="/" class="flex items-center gap-2 text-sm font-bold transition hover:text-primary">← Back to Home</Link>
                <span class="text-right font-mono text-xs text-balance opacity-50">INSTALL GUIDE</span>
            </div>
        </nav>

        <main class="mx-auto max-w-3xl px-6 py-16 lg:py-24">
            <div class="flex flex-col items-center text-center">
                <AppLogoIcon class="size-20" />
                <h1 class="mt-6 text-4xl font-black tracking-tighter uppercase lg:text-5xl">Get the <span class="text-primary">App</span></h1>
                <p class="mt-4 max-w-xl font-medium text-muted-content">
                    Clipper-MS works like a native app on your phone and computer. No app store, no download size, just add it to your Home
                    Screen.
                </p>

                <div
                    v-if="isInstalled"
                    class="mt-8 flex items-center gap-3 rounded-2xl border border-border-color bg-badge-success-bg px-5 py-4 text-sm font-semibold"
                >
                    <CircleCheck class="size-5 shrink-0 text-success" />
                    You’re already using the installed app. Nice!
                </div>

                <AppButton
                    v-else-if="canPromptNatively"
                    type="button"
                    size="lg"
                    pill
                    class="mt-8 h-auto py-4 shadow-2xl hover:scale-105"
                    @click="promptInstall"
                >
                    <Download />
                    Install Clipper-MS
                </AppButton>
            </div>

            <section class="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div v-for="benefit in benefits" :key="benefit.title" class="flex items-start gap-3 rounded-2xl border border-border-color bg-component-background p-4">
                    <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <component :is="benefit.icon" class="size-5" />
                    </span>
                    <div>
                        <p class="text-sm font-bold">{{ benefit.title }}</p>
                        <p class="mt-0.5 text-xs leading-relaxed text-muted-content">{{ benefit.text }}</p>
                    </div>
                </div>
            </section>

            <section class="mt-16">
                <h2 class="text-2xl font-black tracking-tight">How to install</h2>
                <p v-if="!canPromptNatively" class="mt-2 text-sm text-muted-content">We picked the guide for your device. Using something else? Switch below.</p>
                <p v-else class="mt-2 text-sm text-muted-content">Prefer doing it by hand, or installing on another device? Pick it below.</p>

                <div class="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Device type">
                    <button
                        v-for="group in groups"
                        :key="group.id"
                        type="button"
                        role="tab"
                        :aria-selected="selectedGroup === group.id"
                        class="inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
                        :class="
                            selectedGroup === group.id
                                ? 'border-primary bg-primary text-button-content hover:brightness-90'
                                : 'border-border-color bg-component-background text-primary-content hover:border-primary/50 hover:text-primary'
                        "
                        @click="selectedGroup = group.id"
                    >
                        <component :is="group.icon" class="size-4" />
                        {{ group.label }}
                    </button>
                </div>

                <p class="mt-6 text-sm leading-relaxed text-muted-content">{{ activeGroup.intro }}</p>

                <div class="mt-6 space-y-4" role="tabpanel">
                    <article
                        v-for="guide in activeGroup.guides"
                        :key="guide.id"
                        class="rounded-2xl border bg-component-background p-5 transition"
                        :class="isDetectedGuide(guide) ? 'border-primary shadow-lg shadow-primary/10' : 'border-border-color'"
                    >
                        <header class="flex flex-wrap items-center justify-between gap-2">
                            <h3 class="text-lg font-bold">{{ guide.browser }}</h3>
                            <span
                                v-if="isDetectedGuide(guide)"
                                class="rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] font-bold tracking-wider text-primary uppercase"
                            >
                                Your browser
                            </span>
                        </header>

                        <ol class="mt-4 space-y-3">
                            <li v-for="(step, index) in guide.steps" :key="index" class="flex items-start gap-3">
                                <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <component :is="step.icon" class="size-4" />
                                </span>
                                <p class="pt-1.5 text-sm leading-relaxed">
                                    <span class="font-bold text-primary">{{ index + 1 }}.</span>
                                    {{ step.text }}
                                </p>
                            </li>
                        </ol>

                        <p v-if="guide.note" class="mt-4 flex items-start gap-2 text-xs text-muted-content">
                            <Info class="mt-0.5 size-3.5 shrink-0" />
                            {{ guide.note }}
                        </p>
                    </article>
                </div>
            </section>

            <section class="mt-16 rounded-2xl border border-border-color bg-component-background p-6">
                <h2 class="text-lg font-bold">Removing the app</h2>
                <p class="mt-2 text-sm leading-relaxed text-muted-content">
                    Remove it like any other app: long-press the icon and choose “Remove” or “Uninstall”. On a computer, open the app, click the
                    menu in its title bar and choose “Uninstall”. Your collection stays safe in your account.
                </p>
            </section>
        </main>

        <GlobalFooter />
    </div>
</template>
