<?php

namespace App\Filament\Resources\Shop\Customers\Schemas;

use App\Models\Shop\Customer;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Awcodes\Curator\Components\Forms\CuratorPicker;

class CustomerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        TextInput::make('name')
                            ->label('Họ và tên')
                            ->maxLength(255)
                            ->required(),

                        TextInput::make('email')
                            ->label('Email address')
                            ->required()
                            ->email()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),

                        TextInput::make('phone')
                            ->label('Số điện thoại')
                            ->maxLength(255),

                        DatePicker::make('birthday')
                            ->label('Ngày sinh')
                            ->maxDate('today'),

                        Select::make('gender')
                            ->label('Giới tính')
                            ->options([
                                'male' => 'Nam',
                                'female' => 'Nữ',
                                'other' => 'Khác',
                            ]),

                        TextInput::make('photo')
                            ->label('Ảnh đại diện (Zalo URL)')
                            ->helperText('Đường dẫn ảnh đại diện từ Zalo')
                            ->maxLength(255),

                        CuratorPicker::make('avatar_id')
                            ->label('Ảnh đại diện (Thư viện)')
                            ->relationship('avatar', 'id')
                            ->helperText('Hoặc chọn ảnh đại diện từ thư viện media'),
                    ])
                    ->columns(2)
                    ->columnSpan(['lg' => 3]),

                Section::make()
                    ->schema([
                        TextEntry::make('created_at')
                            ->state(fn (Customer $record): ?string => $record->created_at?->diffForHumans()),

                        TextEntry::make('updated_at')
                            ->label('Last modified at')
                            ->state(fn (Customer $record): ?string => $record->updated_at?->diffForHumans()),
                    ])
                    ->columnSpan(['lg' => 1])
                    ->hidden(fn (?Customer $record) => $record === null),
            ])
            ->columns(4);
    }
}
