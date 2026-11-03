<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import AppButton from '@/components/AppButton.vue';
import { Input } from '@/components/ui';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { store } from '@/routes/two-factor/login';
import { Form, Head } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

interface AuthConfigContent {
    title: string;
    description: string;
    toggleText: string;
}

const authConfigContent = computed<AuthConfigContent>(() => {
    if (showRecoveryInput.value) {
        return {
            title: 'Recovery Code',
            description:
                'Confirm access to your account by entering one of your emergency recovery codes.',
            toggleText: 'Use authentication code',
        };
    }

    return {
        title: 'Two-Factor Auth',
        description:
            'Enter the 6-digit code provided by your authenticator app.',
        toggleText: 'Use a recovery code',
    };
});

const showRecoveryInput = ref<boolean>(false);

const toggleRecoveryMode = (clearErrors: () => void): void => {
    showRecoveryInput.value = !showRecoveryInput.value;
    clearErrors();
    code.value = '';
};

const code = ref<string>('');
</script>

<template>
    <AuthLayout
        :title="authConfigContent.title"
        :description="authConfigContent.description"
    >
        <Head title="Two-Factor Authentication" />

        <div class="space-y-6">
            <template v-if="!showRecoveryInput">
                <Form
                    v-bind="store.form()"
                    class="space-y-6"
                    reset-on-error
                    @error="code = ''"
                    #default="{ errors, processing, clearErrors }"
                >
                    <input type="hidden" name="code" :value="code" />
                    
                    <div class="flex flex-col items-center justify-center space-y-4">
                        <div class="flex w-full items-center justify-center">
                            <InputOTP
                                id="otp"
                                v-model="code"
                                :maxlength="6"
                                :disabled="processing"
                                autofocus
                            >
                                <InputOTPGroup class="gap-2">
                                    <InputOTPSlot
                                        v-for="index in 6"
                                        :key="index"
                                        :index="index - 1"
                                        class="h-12 w-10 rounded-xl border-border-color text-lg font-bold focus:ring-2 focus:ring-[var(--primary)] bg-component-background"
                                    />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <InputError :message="errors.code" />
                    </div>

                    <AppButton 
                        type="submit" 
                        size="lg"
                        class="w-full"
                        :loading="processing"
                        :disabled="code.length < 6"
                    >
                        Verify Code
                    </AppButton>

                    <div class="text-center text-sm">
                        <button
                            type="button"
                            class="font-bold text-primary transition-colors hover:underline"
                            @click="() => toggleRecoveryMode(clearErrors)"
                        >
                            {{ authConfigContent.toggleText }}
                        </button>
                    </div>
                </Form>
            </template>

            <template v-else>
                <Form
                    v-bind="store.form()"
                    class="space-y-6"
                    reset-on-error
                    #default="{ errors, processing, clearErrors }"
                >
                    <div class="grid gap-2">
                        <Input
                            name="recovery_code"
                            type="text"
                            placeholder="Enter 8-character recovery code"
                            class="rounded-xl border-border-color py-6 text-center font-mono uppercase tracking-widest focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-component-background"
                            :autofocus="showRecoveryInput"
                            required
                        />
                        <InputError :message="errors.recovery_code" />
                    </div>

                    <AppButton 
                        type="submit" 
                        size="lg"
                        class="w-full"
                        :loading="processing"
                    >
                        Continue
                    </AppButton>

                    <div class="text-center text-sm">
                        <button
                            type="button"
                            class="font-bold text-primary transition-colors hover:underline"
                            @click="() => toggleRecoveryMode(clearErrors)"
                        >
                            {{ authConfigContent.toggleText }}
                        </button>
                    </div>
                </Form>
            </template>
        </div>
    </AuthLayout>
</template>
