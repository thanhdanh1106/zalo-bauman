# Dynamic Form với Conditional Fields

## Tổng quan

DynamicForm đã được nâng cấp để hỗ trợ hiển thị/ẩn các field dựa trên điều kiện (condition). Bạn có thể định nghĩa các điều kiện phức tạp để kiểm soát việc hiển thị field dựa trên giá trị của các field khác.

## Cách sử dụng

### 1. Điều kiện đơn giản (FieldCondition)

```json
{
  "name": "company_name",
  "label": "Tên công ty",
  "type": "text",
  "condition": {
    "field": "user_type",
    "operator": "===",
    "value": "business"
  }
}
```

### 2. Điều kiện nhóm (FieldConditionGroup)

```json
{
  "name": "student_id",
  "label": "Mã số sinh viên",
  "type": "text",
  "condition": {
    "logic": "AND",
    "conditions": [
      {
        "field": "user_type",
        "operator": "===",
        "value": "individual"
      },
      {
        "field": "age",
        "operator": "<=",
        "value": 25
      }
    ]
  }
}
```

## Các toán tử được hỗ trợ

| Toán tử | Mô tả | Ví dụ |
|---------|-------|--------|
| `===` | Bằng chính xác | `"value": "business"` |
| `!=` | Không bằng | `"value": "individual"` |
| `>` | Lớn hơn | `"value": 18` |
| `<` | Nhỏ hơn | `"value": 65` |
| `>=` | Lớn hơn hoặc bằng | `"value": 18` |
| `<=` | Nhỏ hơn hoặc bằng | `"value": 65` |
| `includes` | Chứa giá trị (array/string) | `"value": "phone"` |
| `not_includes` | Không chứa giá trị | `"value": "email"` |
| `in` | Giá trị trong danh sách | `"values": ["premium", "enterprise"]` |
| `not_in` | Giá trị không trong danh sách | `"values": ["basic"]` |
| `empty` | Trống (array/object/string) | Không cần value |
| `not_empty` | Không trống | Không cần value |

## Logic kết hợp

### AND Logic
Tất cả điều kiện phải đúng:

```json
{
  "logic": "AND",
  "conditions": [
    { "field": "age", "operator": ">=", "value": 18 },
    { "field": "country", "operator": "===", "value": "VN" }
  ]
}
```

### OR Logic
Ít nhất một điều kiện đúng:

```json
{
  "logic": "OR",
  "conditions": [
    { "field": "user_type", "operator": "===", "value": "premium" },
    { "field": "subscription", "operator": "===", "value": "enterprise" }
  ]
}
```

## Ví dụ thực tế

### 1. Hiển thị field tuổi chỉ cho cá nhân

```json
{
  "name": "age",
  "label": "Tuổi",
  "type": "number",
  "condition": {
    "field": "user_type",
    "operator": "===",
    "value": "individual"
  }
}
```

### 2. Hiển thị field ngân sách cho doanh nghiệp với gói cao cấp

```json
{
  "name": "budget",
  "label": "Ngân sách",
  "type": "number",
  "condition": {
    "logic": "AND",
    "conditions": [
      { "field": "user_type", "operator": "===", "value": "business" },
      { "field": "plan", "operator": "in", "values": ["premium", "enterprise"] }
    ]
  }
}
```

### 3. Hiển thị field số điện thoại khi chọn liên hệ qua phone

```json
{
  "name": "phone_number",
  "label": "Số điện thoại",
  "type": "text",
  "condition": {
    "field": "contact_preferences",
    "operator": "includes",
    "value": "phone"
  }
}
```

### 4. Hiển thị field mã giảm giá cho đơn hàng > 1 triệu

```json
{
  "name": "discount_code",
  "label": "Mã giảm giá",
  "type": "text",
  "condition": {
    "field": "order_amount",
    "operator": ">=",
    "value": 1000000
  }
}
```

### 5. Condition phức tạp với nested logic

```json
{
  "name": "premium_features",
  "label": "Tính năng premium",
  "type": "group",
  "condition": {
    "logic": "OR",
    "conditions": [
      { "field": "user_type", "operator": "===", "value": "premium" },
      {
        "logic": "AND",
        "conditions": [
          { "field": "user_type", "operator": "===", "value": "business" },
          { "field": "plan", "operator": "in", "values": ["premium", "enterprise"] }
        ]
      }
    ]
  }
}
```

## Lưu ý khi sử dụng

1. **Field dependency**: Đảm bảo field được reference trong condition tồn tại và được định nghĩa trước field có condition.

2. **Type safety**: Khi so sánh số, hệ thống tự động convert sang Number. Với date, hãy sử dụng string format hoặc timestamp.

3. **Array fields**: Với các field như `tag`, `checkbox`, sử dụng toán tử `includes`, `not_includes`, `empty`, `not_empty`.

4. **Performance**: Condition được evaluate real-time khi form data thay đổi thông qua `useWatch`.

5. **Nested conditions**: Bạn có thể nest nhiều level condition groups để tạo logic phức tạp.

## Schema Interface

```typescript
interface FieldCondition {
  field: string;
  operator: '===' | '!=' | '>' | '<' | '>=' | '<=' | 'includes' | 'not_includes' | 'in' | 'not_in' | 'empty' | 'not_empty';
  value?: any;
  values?: any[];
}

interface FieldConditionGroup {
  logic: 'AND' | 'OR';
  conditions: (FieldCondition | FieldConditionGroup)[];
}

interface FormField {
  // ... other properties
  condition?: FieldCondition | FieldConditionGroup;
}
```