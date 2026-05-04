<?php

namespace App\Filament\Resources\Users\Schemas;

use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;
use Awcodes\Curator\Components\Forms\CuratorPicker;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Thông tin cơ bản')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->label('Họ và tên')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),

                        TextInput::make('password')
                            ->label('Mật khẩu')
                            ->password()
                            ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->confirmed()
                            ->columnSpanFull(),

                        TextInput::make('password_confirmation')
                            ->label('Xác nhận mật khẩu')
                            ->password()
                            ->dehydrated(false)
                            ->required(fn (string $operation): bool => $operation === 'create'),
                    ]),

                Section::make('Phân quyền')
                    ->schema([
                        Select::make('roles')
                            ->label('Vai trò')
                            ->multiple()
                            ->relationship('roles', 'name')
                            ->preload()
                            ->searchable(),

                        Toggle::make('email_verified_at')
                            ->label('Email đã xác minh')
                            ->onColor('success')
                            ->offColor('danger')
                            ->formatStateUsing(fn ($state) => filled($state))
                            ->dehydrateStateUsing(fn ($state) => $state ? now() : null),

                        CuratorPicker::make('avatar_id')
                            ->label('Ảnh đại diện')
                            ->relationship('avatar', 'id')
                            ->helperText('Chọn hoặc tải ảnh đại diện lên thư viện'),
                    ]),
            ]);
    }
}
