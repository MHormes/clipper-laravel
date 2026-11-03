<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import AppButton from '@/components/AppButton.vue';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/vue3';
</script>

<template>
    <AuthLayout
        title="Security Check"
        description="For your security, please confirm your password to continue."
    >
        <Head title="Confirm password" />

        <Form
            v-bind="store.form()"
            reset-on-success
            v-slot="{ errors, processing }"
        >
            <div class="space-y-6">
                <div class="grid gap-2">
                    <Label for="password" class="text-sm font-bold tracking-tight">Your Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        required
                        autocomplete="current-password"
                        autofocus
                        placeholder="••••••••"
                        class="rounded-xl border-border-color focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-component-background"
                    />

                    <InputError :message="errors.password" />
                </div>

                <div class="flex items-center">
                    <AppButton
                        size="lg"
                        class="w-full"
                        :loading="processing"
                        data-test="confirm-password-button"
                    >
                        Confirm Password
                    </AppButton>
                </div>
            </div>
        </Form>
    </AuthLayout>
</template>
