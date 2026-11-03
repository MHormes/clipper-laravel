import { computed, onMounted, ref } from 'vue';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
}

export type InstallPlatform =
    | 'ios'
    | 'android-chrome'
    | 'android-samsung'
    | 'android-firefox'
    | 'android-edge'
    | 'android-other'
    | 'in-app'
    | 'desktop-chromium'
    | 'desktop-safari'
    | 'desktop-firefox'
    | 'desktop-other';

const DISMISSED_KEY = 'install_prompt_dismissed_at';
const DISMISS_COUNT_KEY = 'install_prompt_dismiss_count';

// Days before the popup is shown again after being dismissed
const DISMISS_COOLDOWN_DAYS = 14;

// After this many dismissals the popup never returns, the sidebar button remains
const MAX_DISMISSALS = 2;

const isBrowser = typeof window !== 'undefined';

// Module-level state so every component shares one install prompt and the early event is never missed
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const isInstalled = ref(false);
const platform = ref<InstallPlatform>('desktop-other');
const dismissedAt = ref<number | null>(null);
const dismissCount = ref(0);
const isDetected = ref(false);

function readDismissedAt(): number | null {
    try {
        const value = window.localStorage.getItem(DISMISSED_KEY);

        return value ? Number(value) : null;
    } catch {
        return null;
    }
}

function readDismissCount(): number {
    try {
        return Number(window.localStorage.getItem(DISMISS_COUNT_KEY) ?? '0') || 0;
    } catch {
        return 0;
    }
}

function writeDismissal(timestamp: number, count: number) {
    try {
        window.localStorage.setItem(DISMISSED_KEY, String(timestamp));
        window.localStorage.setItem(DISMISS_COUNT_KEY, String(count));
    } catch {
        // Storage unavailable (private mode), dismissal only lasts this session
    }
}

function detectPlatform(): InstallPlatform {
    const userAgent = window.navigator.userAgent;

    // iPadOS reports itself as macOS, so detect it through touch support
    const isIos = /iPad|iPhone|iPod/i.test(userAgent) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(userAgent);

    // Embedded webviews of social apps cannot install web apps
    if ((isIos || isAndroid) && /FBAN|FBAV|Instagram|Line\/|LinkedInApp|Snapchat|TikTok|Twitter|; wv\)/i.test(userAgent)) {
        return 'in-app';
    }

    if (isIos) {
        return 'ios';
    }

    if (isAndroid) {
        if (/SamsungBrowser/i.test(userAgent)) {
            return 'android-samsung';
        }

        if (/Firefox/i.test(userAgent)) {
            return 'android-firefox';
        }

        if (/EdgA/i.test(userAgent)) {
            return 'android-edge';
        }

        if (/Chrome/i.test(userAgent) && !/OPR|YaBrowser/i.test(userAgent)) {
            return 'android-chrome';
        }

        return 'android-other';
    }

    if (/Firefox/i.test(userAgent)) {
        return 'desktop-firefox';
    }

    if (/Chrome|Chromium|Edg\//i.test(userAgent)) {
        return 'desktop-chromium';
    }

    if (/Safari/i.test(userAgent)) {
        return 'desktop-safari';
    }

    return 'desktop-other';
}

function detectInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

// Runs after mount so the first client render matches the SSR markup
function detectEnvironment() {
    if (isDetected.value) {
        return;
    }

    platform.value = detectPlatform();
    isInstalled.value = detectInstalled();
    dismissedAt.value = readDismissedAt();
    dismissCount.value = readDismissCount();
    isDetected.value = true;
}

// Listeners register on import so an early beforeinstallprompt event is never missed
if (isBrowser) {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
        event.preventDefault();
        deferredPrompt.value = event as BeforeInstallPromptEvent;
    });

    window.addEventListener('appinstalled', () => {
        deferredPrompt.value = null;
        isInstalled.value = true;
    });
}

export function useInstallPrompt() {
    onMounted(detectEnvironment);

    const isMobileDevice = computed(() => !platform.value.startsWith('desktop'));

    const canPromptNatively = computed(() => deferredPrompt.value !== null);

    // Anyone not already running the installed app can install or read the guide
    const canInstall = computed(() => isDetected.value && !isInstalled.value);

    const isDismissed = computed(() => {
        if (dismissCount.value >= MAX_DISMISSALS) {
            return true;
        }

        if (dismissedAt.value === null) {
            return false;
        }

        return Date.now() - dismissedAt.value < DISMISS_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    });

    // The automatic popup is reserved for mobile, where installing matters most
    const shouldShowPopup = computed(() => isMobileDevice.value && canInstall.value && !isDismissed.value);

    const promptInstall = async () => {
        if (!deferredPrompt.value) {
            return false;
        }

        const promptEvent = deferredPrompt.value;

        await promptEvent.prompt();

        const { outcome } = await promptEvent.userChoice;

        deferredPrompt.value = null;

        if (outcome === 'accepted') {
            isInstalled.value = true;
        }

        return outcome === 'accepted';
    };

    const dismiss = () => {
        const now = Date.now();

        dismissedAt.value = now;
        dismissCount.value += 1;
        writeDismissal(now, dismissCount.value);
    };

    return {
        isDetected: computed(() => isDetected.value),
        platform: computed(() => platform.value),
        isMobileDevice,
        isInstalled: computed(() => isInstalled.value),
        canInstall,
        canPromptNatively,
        shouldShowPopup,
        promptInstall,
        dismiss,
    };
}
