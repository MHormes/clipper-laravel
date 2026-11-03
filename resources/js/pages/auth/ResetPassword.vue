<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import AppButton from '@/components/AppButton.vue';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { update } from '@/routes/password';
import { Form, Head } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps<{
    token: string;
    email: string;
}>();

const inputEmail = ref(props.email);
</script>

<template>
    <AuthLayout
        title="Set new password"
        description="Almost there! Enter a secure new password for your account."
    >
        <Head title="Reset password" />

        <Form
            v-bind="update.form()"
            :transform="(data) => ({ ...data, token, email })"
            :reset-on-success="['password', 'password_confirmation']"
            v-slot="{ errors, processing }"
            class="flex flex-col gap-6"
        >
            <div class="grid gap-5">
                <div class="grid gap-2">
                    <Label for="email" class="text-sm font-bold tracking-tight opacity-50">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        autocomplete="email"
                        v-model="inputEmail"
                        readonly
                        class="rounded-xl border-border-color bg-muted-background/50 opacity-60 cursor-not-allowed bg-component-background"
                    />
                    <InputError :message="errors.email" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="grid gap-2">
                        <Label for="password" class="text-sm font-bold tracking-tight">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            autocomplete="new-password"
                            autofocus
                            placeholder="••••••••"
                            class="rounded-xl border-border-color focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-component-background"
                        />
                    </div>

                    <div class="grid gap-2">
                        <Label for="password_confirmation" class="text-sm font-bold tracking-tight">Confirm</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            autocomplete="new-password"
                            placeholder="••••••••"
                            class="rounded-xl border-border-color focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-component-background"
                        />
                    </div>
                </div>

                <div class="col-span-full">
                    <InputError :message="errors.password" />
                    <InputError :message="errors.password_confirmation" />
                </div>

                <AppButton
                    type="submit"
                    size="lg"
                    class="mt-4 w-full"
                    :loading="processing"
                    data-test="reset-password-button"
                >
                    Reset Password
                </AppButton>
            </div>
        </Form>
    </AuthLayout>
</template>
