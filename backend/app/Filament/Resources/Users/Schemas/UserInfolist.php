<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Schemas\Schema;

class UserInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('name')
                    ->label('Họ và tên'),
                TextEntry::make('email')
                    ->label('Địa chỉ Email'),
                TextEntry::make('email_verified_at')
                    ->label('Xác minh Email lúc')
                    ->dateTime()
                    ->placeholder('Chưa xác minh'),
                TextEntry::make('created_at')
                    ->label('Ngày tạo')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->label('Ngày cập nhật')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('roles.name')
                    ->label('Vai trò')
                    ->badge()
                    ->color('success')
                    ->placeholder('Không có vai trò'),
                ImageEntry::make('avatar.url')
                    ->label('Ảnh đại diện')
                    ->circular()
                    ->placeholder('Không có ảnh'),
            ]);
    }
}
