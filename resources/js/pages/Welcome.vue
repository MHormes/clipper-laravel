<script setup lang="ts">
import { login, register } from '@/routes';
import AppButton from '@/components/AppButton.vue';
import InstallAppButton from '@/components/InstallAppButton.vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import CursorCard from '@/components/CursorCard.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import { useInstallPrompt } from '@/composables/useInstallPrompt';
import { Head } from '@inertiajs/vue3';
import { Smartphone } from '@lucide/vue';

defineProps<{
    canRegister: boolean;
}>();

const { canInstall } = useInstallPrompt();

const stats = [
    { label: 'Total Series', value: '100+' },
    { label: 'Unique Clippers', value: '400+' },
    { label: 'Active Collectors', value: '20+' },
];
</script>

<template>
    <Head>
        <title>Clipper-MS | Track Your Clipper Lighter Collection</title>
    </Head>

    <div
        class="min-h-screen bg-primary-background text-primary-content selection:bg-primary selection:text-button-content"
    >
        <nav class="fixed top-0 z-50 w-full border-b border-border-color bg-primary-background/80 backdrop-blur-md">
            <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div class="flex items-center gap-2">
                    <AppLogoIcon class="h-12 w-12" />
                    <span class="text-xl font-black tracking-tighter"
                        >CLIPPER<span class="text-primary">-MS</span></span
                    >
                </div>
                <div class="flex items-center gap-4">
                    <!-- Hidden on small screens where the nav is too cramped -->
                    <div class="hidden sm:block">
                        <InstallAppButton />
                    </div>
                    <AppButton :href="login()" variant="outline" pill class="px-5">Log in</AppButton>
                    <AppButton
                        v-if="canRegister"
                        :href="register()"
                        pill
                        class="px-5 font-black hover:scale-105"
                    >
                        Get Started
                    </AppButton>
                </div>
            </div>
        </nav>

        <header class="relative pt-32 pb-16 lg:pt-48 lg:pb-32">
            <div class="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-12">
                <div class="flex-1 text-center lg:text-left">
                    <h1 class="text-6xl font-black tracking-tight lg:text-7xl">
                        Track Your <br />
                        <span class="text-primary">Collection.</span>
                    </h1>
                    <p class="mx-auto mt-8 max-w-2xl text-xl leading-8 text-muted-content lg:mx-0">
                        The ultimate management system for Clipper enthusiasts. Discover, catalog, and complete your
                        collection of legendary 4-design series with precision.
                    </p>
                    <div class="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                        <AppButton
                            v-if="canRegister"
                            :href="register()"
                            size="lg"
                            pill
                            class="h-auto py-4 shadow-2xl hover:scale-105"
                        >
                            Start Your Collection
                        </AppButton>
                        <!-- Mobile replacement for the install button hidden in the nav -->
                        <AppButton v-if="canInstall" href="/install" variant="secondary" size="lg" pill class="h-auto py-4 hover:scale-105 sm:hidden">
                            <Smartphone />
                            Get the App
                        </AppButton>
                    </div>
                </div>

                <div class="relative mt-16 flex-1 lg:mt-0">
                    <div class="grid grid-cols-2 gap-4">
                        <picture>
                            <source srcset="/images/hero.webp" type="image/webp" />
                            <img
                                src="/images/hero.png"
                                class="transform transition duration-500 hover:rotate-0 lg:-rotate-3"
                                alt="Clipper 1"
                                width="517"
                                height="482"
                                fetchpriority="high"
                            />
                        </picture>
                        <picture>
                            <source srcset="/images/hero_2.webp" type="image/webp" />
                            <img
                                src="/images/hero_2.png"
                                class="mt-12 transform transition duration-500 hover:rotate-0 lg:rotate-3"
                                alt="Clipper 2"
                                width="516"
                                height="484"
                            />
                        </picture>
                    </div>
                </div>
            </div>
        </header>

        <section class="bg-primary-background py-24">
            <div class="mx-auto max-w-7xl px-6">
                <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <CursorCard
                        v-for="stat in stats"
                        :key="stat.label"
                        className="rounded-3xl border border-border-color bg-component-background p-8 text-center hover:border-primary/30"
                    >
                        <p class="relative z-10 text-5xl font-black text-primary">{{ stat.value }}</p>
                        <p
                            class="relative z-10 mt-2 text-[10px] font-bold tracking-widest text-muted-content uppercase opacity-70"
                        >
                            {{ stat.label }}
                        </p>
                    </CursorCard>
                </div>
            </div>
        </section>

        <section class="py-24">
            <div class="mx-auto max-w-4xl px-6 text-center">
                <CursorCard
                    className="rounded-[3rem] bg-[var(--hero-card-bg)] p-12 text-button-content shadow-2xl"
                    lightColor="bg-white/10"
                    lightSize="w-64 h-64"
                >
                    <h2 class="relative z-10 text-4xl font-black tracking-tight uppercase">
                        Ready to finish that set?
                    </h2>
                    <p class="relative z-10 mt-4 font-medium text-button-content/80">
                        Join other collectors and get your collection organized today.
                    </p>
                    <AppButton
                        v-if="canRegister"
                        :href="register()"
                        size="lg"
                        pill
                        class="relative z-10 mt-8 h-auto px-10 py-4 text-xs font-black tracking-widest uppercase shadow-xl hover:scale-105"
                    >
                        Create Free Account
                    </AppButton>
                </CursorCard>
            </div>
        </section>

        <GlobalFooter />
    </div>
</template>
