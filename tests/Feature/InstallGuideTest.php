<?php

use Inertia\Testing\AssertableInertia as Assert;

test('install guide page is publicly accessible', function () {
    $response = $this->get(route('install'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page->component('Install'));
});

test('install guide page is listed in the sitemap', function () {
    $response = $this->get('/sitemap.xml');

    $response->assertOk();
    $response->assertSee(url('/install'), false);
});
