<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head } from '@inertiajs/vue3';
import AppButton from '@/components/AppButton.vue';
import SeriesForm from '@/components/series/SeriesForm.vue';
import { route } from 'ziggy-js';

const props = defineProps<{ series: any }>();

const submit = (form: any) => {
    console.log(form)
    form.transform((data: any) => ({
        ...data,
        _method: 'PUT',
    })).post(route('series.update', props.series.id), {
        forceFormData: true,
        preserveScroll: true,
        onError: (errors: Record<string, string>) => {
            console.error("Server-side validation failed:", errors);
        }
    });
};
</script>

<template>

    <Head :title="'Edit ' + series.name" />
    <AppLayout>
        <div class="max-w-5xl mx-auto p-4 md:p-6">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-black uppercase tracking-tighter">Edit Series</h1>
                    <p class="text-[10px] text-muted-content font-mono">{{ series.id }}</p>
                </div>
                <AppButton :href="route('series.show', series.id)" variant="outline-primary" size="sm"
                    class="rounded-md font-black uppercase">
                    View Live Page
                </AppButton>
            </div>

            <SeriesForm mode="edit" :initial-data="series" submit-label="Save Changes" @submit="submit" />
        </div>
    </AppLayout>
</template>
