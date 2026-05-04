<?php

test('redirects to the configured Zalo mini app', function () {
    config(['services.zalo.app_id' => '3716133636548847379']);

    $this->get('/')
        ->assertRedirect('https://zalo.me/s/3716133636548847379/');
});

test('keeps the ref query parameter', function () {
    config(['services.zalo.app_id' => '3716133636548847379']);

    $this->get('/?ref=abc123')
        ->assertRedirect('https://zalo.me/s/3716133636548847379/?ref=abc123');
});
