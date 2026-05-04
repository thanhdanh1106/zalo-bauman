<?php

namespace App\Filament\Widgets;

use App\Filament\Pages\ShopDashboard;
use App\Filament\Resources\Blog\Authors\AuthorResource;
use App\Filament\Resources\Blog\Categories\CategoryResource as BlogCategoryResource;
use App\Filament\Resources\Blog\Posts\PostResource;
use App\Filament\Resources\Shop\Brands\BrandResource;
use App\Filament\Resources\Shop\Customers\CustomerResource;
use App\Filament\Resources\Shop\Orders\OrderResource;
use App\Filament\Resources\Shop\Products\ProductResource;
use App\Models\Blog\Post;
use App\Models\Shop\Order;
use App\Models\Shop\Product;
use Filament\Widgets\Widget;
use Illuminate\Database\Eloquent\Model;

class FeaturesOverview extends Widget
{
    protected string $view = 'filament.widgets.features-overview';

    protected int | string | array $columnSpan = 'full';

    protected static bool $isLazy = false;

    /**
     * @return array<int, array{name: string, icon: string, color: string, features: array<int, array{name: string, description: string, url: string, resource: string}>}>
     */
    public function getCategories(): array
    {
        $post = Post::query()->first();
        $order = Order::query()->first();
        $product = Product::query()->first();

        return array_filter(array_map(
            fn (?array $category): ?array => $category && count($category['features']) > 0 ? $category : null,
            [
                $this->tablesCategory(),
                $this->formsCategory($order, $post, $product),
                $this->filtersCategory(),
                $this->actionsCategory(),
                $this->infolistsCategory($post),
                $this->pageActionsCategory($order, $post),
                $this->navigationCategory($post, $product),
            ],
        ));
    }

    /**
     * @return array{name: string, icon: string, color: string, features: list<array{name: string, description: string, url: string, resource: string}>}
     */
    protected function tablesCategory(): array
    {
        return [
            'name' => 'Bảng & Cột',
            'icon' => 'heroicon-o-table-cells',
            'color' => 'blue',
            'features' => [
                ['name' => 'Tìm kiếm & sắp xếp', 'description' => 'Tìm kiếm toàn văn với các tiêu đề cột có thể sắp xếp', 'url' => ProductResource::getUrl('index'), 'resource' => 'Sản phẩm'],
                ['name' => 'Cột hình ảnh', 'description' => 'Hình thu nhỏ từ Courier Media', 'url' => ProductResource::getUrl('index'), 'resource' => 'Sản phẩm'],
                ['name' => 'Tổng kết cột', 'description' => 'Xem tổng số tiền cho giá và vận chuyển ở cuối bảng', 'url' => OrderResource::getUrl('index'), 'resource' => 'Đơn hàng'],
                ['name' => 'Nhóm bảng', 'description' => 'Bật/tắt nhóm bằng biểu tượng nhóm trong tiêu đề bảng', 'url' => OrderResource::getUrl('index'), 'resource' => 'Đơn hàng'],
                ['name' => 'Cột có thể ẩn/hiện', 'description' => 'Nhấp vào biểu tượng chuyển đổi cột trong tiêu đề bảng', 'url' => ProductResource::getUrl('index'), 'resource' => 'Sản phẩm'],
                ['name' => 'Sắp xếp kéo thả', 'description' => 'Nhấp vào nút sắp xếp lại trong tiêu đề bảng, sau đó kéo các hàng', 'url' => BrandResource::getUrl('index'), 'resource' => 'Thương hiệu'],
            ],
        ];
    }

    /**
     * @return array{name: string, icon: string, color: string, features: list<array{name: string, description: string, url: string, resource: string}>}
     */
    protected function filtersCategory(): array
    {
        return [
            'name' => 'Bộ lọc',
            'icon' => 'heroicon-o-funnel',
            'color' => 'violet',
            'features' => [
                ['name' => 'Trình tạo truy vấn', 'description' => 'Nhấp vào biểu tượng bộ lọc phía trên bảng', 'url' => ProductResource::getUrl('index'), 'resource' => 'Sản phẩm'],
                ['name' => 'Bộ lọc chọn', 'description' => 'Mở bảng bộ lọc để xem các bộ lọc dựa trên lựa chọn', 'url' => OrderResource::getUrl('index'), 'resource' => 'Đơn hàng'],
                ['name' => 'Bộ lọc đã xóa', 'description' => 'Bật/tắt hiển thị các bản ghi đã xóa tạm thời', 'url' => OrderResource::getUrl('index'), 'resource' => 'Đơn hàng'],
                ['name' => 'Bộ lọc phía trên nội dung', 'description' => 'Nhấp vào thanh bộ lọc phía trên bảng để mở rộng', 'url' => ProductResource::getUrl('index'), 'resource' => 'Sản phẩm'],
            ],
        ];
    }

    /**
     * @return array{name: string, icon: string, color: string, features: list<array{name: string, description: string, url: string, resource: string}>}
     */
    protected function actionsCategory(): array
    {
        return [
            'name' => 'Hành động trên bảng',
            'icon' => 'heroicon-o-bolt',
            'color' => 'amber',
            'features' => [
                ['name' => 'Nhóm hành động', 'description' => 'Menu thả xuống nhóm nhiều hành động — nhấp vào nút "..." trên bất kỳ hàng nào', 'url' => ProductResource::getUrl('index'), 'resource' => 'Sản phẩm'],
                ['name' => 'Slide-over modals', 'description' => 'Cửa sổ trượt từ cạnh màn hình để xem thông tin chi tiết', 'url' => OrderResource::getUrl('index'), 'resource' => 'Đơn hàng'],
                ['name' => 'Biểu mẫu modal', 'description' => 'Mở các form nhập liệu nhanh ngay trong modal', 'url' => CustomerResource::getUrl('index'), 'resource' => 'Khách hàng'],
                ['name' => 'Hành động URL', 'description' => 'Nhấp vào biểu tượng trang web để truy cập liên kết ngoài', 'url' => BrandResource::getUrl('index'), 'resource' => 'Thương hiệu'],
                ['name' => 'Tooltips', 'description' => 'Di chuột qua các biểu tượng hành động để xem gợi ý', 'url' => BrandResource::getUrl('index'), 'resource' => 'Thương hiệu'],
                ['name' => 'Hành động hàng loạt', 'description' => 'Chọn nhiều hàng và thực hiện hành động cùng lúc', 'url' => ProductResource::getUrl('index'), 'resource' => 'Sản phẩm'],
            ],
        ];
    }

    /**
     * @return array{name: string, icon: string, color: string, features: list<array{name: string, description: string, url: string, resource: string}>}
     */
    protected function pageActionsCategory(?Model $order, ?Model $post): array
    {
        return [
            'name' => 'Hành động trên trang & tiêu đề',
            'icon' => 'heroicon-o-rectangle-stack',
            'color' => 'rose',
            'features' => array_values(array_filter([
                $order ? ['name' => 'Sao chép bản ghi', 'description' => 'Nhấp vào "Sao chép" ở đầu trang chỉnh sửa', 'url' => OrderResource::getUrl('edit', ['record' => $order]), 'resource' => 'Đơn hàng'] : null,
                $post ? ['name' => 'Phím tắt bàn phím', 'description' => 'Sử dụng phím tắt để thao tác nhanh hơn', 'url' => PostResource::getUrl('view', ['record' => $post]), 'resource' => 'Bài viết'] : null,
                ['name' => 'Hành động Xuất dữ liệu', 'description' => 'Sử dụng Excel/CSV để xuất danh sách', 'url' => AuthorResource::getUrl('index'), 'resource' => 'Tác giả'],
                ['name' => 'Hành động Nhập dữ liệu', 'description' => 'Nhập dữ liệu từ file vào hệ thống', 'url' => BlogCategoryResource::getUrl('index'), 'resource' => 'Danh mục bài viết'],
            ])),
        ];
    }

    /**
     * @return array{name: string, icon: string, color: string, features: list<array{name: string, description: string, url: string, resource: string}>}
     */
    protected function formsCategory(?Model $order, ?Model $post, ?Model $product): array
    {
        return [
            'name' => 'Biểu mẫu (Forms)',
            'icon' => 'heroicon-o-pencil-square',
            'color' => 'emerald',
            'features' => array_values(array_filter([
                ['name' => 'Wizard', 'description' => 'Biểu mẫu tạo gồm nhiều bước kế tiếp', 'url' => OrderResource::getUrl('create'), 'resource' => 'Đơn hàng'],
                $order ? ['name' => 'Repeater', 'description' => 'Thêm nhiều dòng dữ liệu linh hoạt (như các dòng sản phẩm)', 'url' => OrderResource::getUrl('edit', ['record' => $order]), 'resource' => 'Đơn hàng'] : null,
                $post ? ['name' => 'Trình soạn thảo Rich Text', 'description' => 'Soạn thảo nội dung chuyên nghiệp', 'url' => PostResource::getUrl('edit', ['record' => $post]), 'resource' => 'Bài viết'] : null,
                $product ? ['name' => 'Tải lên Media', 'description' => 'Tải và sắp xếp nhiều hình ảnh', 'url' => ProductResource::getUrl('edit', ['record' => $product]), 'resource' => 'Sản phẩm'] : null,
                ['name' => 'Inline create', 'description' => 'Tạo nhanh bản ghi liên quan ngay trong form', 'url' => OrderResource::getUrl('create'), 'resource' => 'Đơn hàng'],
                $post ? ['name' => 'Tags input', 'description' => 'Quản lý các thẻ (tags) cho bài viết', 'url' => PostResource::getUrl('edit', ['record' => $post]), 'resource' => 'Bài viết'] : null,
            ])),
        ];
    }

    /**
     * @return array{name: string, icon: string, color: string, features: list<array{name: string, description: string, url: string, resource: string}>}
     */
    protected function infolistsCategory(?Model $post): array
    {
        return [
            'name' => 'Xem chi tiết (Infolists)',
            'icon' => 'heroicon-o-eye',
            'color' => 'cyan',
            'features' => array_values(array_filter([
                $post ? ['name' => 'Hiển thị Rich Text', 'description' => 'Xem nội dung bài viết đầy đủ định dạng', 'url' => PostResource::getUrl('view', ['record' => $post]), 'resource' => 'Bài viết'] : null,
                $post ? ['name' => 'Hiển thị Media', 'description' => 'Xem các hình ảnh bài viết từ Courier', 'url' => PostResource::getUrl('view', ['record' => $post]), 'resource' => 'Bài viết'] : null,
            ])),
        ];
    }

    /**
     * @return array{name: string, icon: string, color: string, features: list<array{name: string, description: string, url: string, resource: string}>}
     */
    protected function navigationCategory(?Model $post, ?Model $product): array
    {
        return [
            'name' => 'Điều hướng & Trang',
            'icon' => 'heroicon-o-squares-2x2',
            'color' => 'gray',
            'features' => array_values(array_filter([
                ['name' => 'Navigation badges', 'description' => 'Số lượng bản ghi hiển thị ngay trên menu', 'url' => OrderResource::getUrl('index'), 'resource' => 'Đơn hàng'],
                $post ? ['name' => 'Sub-navigation', 'description' => 'Các tab điều hướng phụ bên trong tài liệu', 'url' => PostResource::getUrl('view', ['record' => $post]), 'resource' => 'Bài viết'] : null,
                ['name' => 'Dashboard widgets', 'description' => 'Các widget biểu đồ và thống kê trên dashboard', 'url' => ShopDashboard::getUrl(), 'resource' => 'Cửa hàng'],
                ['name' => 'Manage records', 'description' => 'Quản lý bản ghi (Tạo, Sửa, Xóa) ngay trên trang danh sách', 'url' => AuthorResource::getUrl('index'), 'resource' => 'Tác giả'],
                $product ? ['name' => 'Relation managers', 'description' => 'Quản lý các bản ghi liên quan bên dưới biểu mẫu chính', 'url' => ProductResource::getUrl('edit', ['record' => $product]), 'resource' => 'Sản phẩm'] : null,
                ['name' => 'Global search', 'description' => 'Tìm kiếm toàn cục trên toàn hệ thống (Cmd+K)', 'url' => ProductResource::getUrl('index'), 'resource' => 'Thử ngay!'],
            ])),
        ];
    }
}
