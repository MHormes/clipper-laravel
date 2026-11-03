<script setup lang="ts">
import AppButton from '@/components/AppButton.vue';
import { Separator } from '@/components/ui';
import { useActiveUrl } from '@/composables/useActiveUrl';
import { toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editNotifications } from '@/routes/notifications';
import { edit as editProfile } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: editProfile(),
    },
    {
        title: 'Password',
        href: editPassword(),
    },
    {
        title: 'Two-Factor Auth',
        href: show(),
    },
    {
        title: 'Appearance',
        href: editAppearance(),
    },
    {
        title: 'Notifications',
        href: editNotifications(),
    },
];

const { urlIsActive } = useActiveUrl();
</script>

<template>
    <div class="px-4 py-6">
        <div class="mb-8 space-y-0.5">
            <h2 class="text-xl font-semibold tracking-tight">Settings</h2>
            <p class="text-sm text-muted-content">
                Manage your profile and account settings
            </p>
        </div>

        <div class="flex flex-col lg:flex-row lg:space-x-12">
            <aside class="w-full max-w-xl lg:w-48">
                <nav class="flex flex-col space-y-1 space-x-0" aria-label="Settings">
                    <AppButton
                        v-for="item in sidebarNavItems"
                        :key="toUrl(item.href)"
                        :href="item.href"
                        :aria-current="urlIsActive(item.href) ? 'page' : undefined"
                        variant="ghost"
                        :class="[
                            'w-full justify-start rounded-md border-l-2 border-transparent px-4',
                            urlIsActive(item.href) && 'border-primary bg-muted-background text-primary shadow-sm',
                        ]"
                    >
                        <component :is="item.icon" />
                        {{ item.title }}
                    </AppButton>
                </nav>
            </aside>

            <Separator class="my-6 lg:hidden" />

            <div class="flex-1 md:max-w-2xl">
                <section class="max-w-xl space-y-12">
                    <slot />
                </section>
            </div>
        </div>
    </div>
</template>
