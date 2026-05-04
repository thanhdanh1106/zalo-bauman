<?php

namespace App\Http\Controllers\Api\MiniApp\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Address;
use App\Models\Shop\Customer;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $customer = Customer::where('email', $user->email)->first();

        if (!$customer) {
            return response()->json(['error' => false, 'data' => []]);
        }

        $addresses = $customer->addresses;

        return response()->json([
            'error' => false,
            'data' => $addresses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'street' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:3',
            'type' => 'nullable|string|max:20',
            'isDefault' => 'nullable|boolean',
            'is_default' => 'nullable|boolean',
        ]);

        if (!isset($validated['street']) && isset($validated['address'])) {
            $validated['street'] = $validated['address'];
        }
        
        if (!isset($validated['city'])) {
            $validated['city'] = 'N/A';
        }

        if (isset($validated['isDefault'])) {
            $validated['is_default'] = $validated['isDefault'];
        }

        $user = $request->user();
        $customer = Customer::where('email', $user->email)->first();

        if (!$customer) {
            $customer = Customer::create([
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $validated['phone'] ?? '',
            ]);
        }

        if (!empty($validated['is_default'])) {
            $customer->addresses()->update(['is_default' => false]);
        }

        $dbData = collect($validated)->except(['isDefault', 'address'])->toArray();
        $address = Address::create($dbData);
        $customer->addresses()->attach($address);

        return response()->json([
            'error' => false,
            'data' => $address,
            'message' => 'Đã thêm địa chỉ thành công',
        ]);
    }

    public function update(Request $request, $id)
    {
        $address = Address::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:500',
            'street' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:3',
            'type' => 'sometimes|string|max:20',
            'isDefault' => 'sometimes|boolean',
            'is_default' => 'sometimes|boolean',
        ]);

        if (isset($validated['address']) && !isset($validated['street'])) {
            $validated['street'] = $validated['address'];
        }

        if (isset($validated['isDefault'])) {
            $validated['is_default'] = $validated['isDefault'];
        }

        if (!empty($validated['is_default'])) {
            $user = $request->user();
            $customer = Customer::where('email', $user->email)->first();
            if ($customer) {
                $customer->addresses()->update(['is_default' => false]);
            }
        }

        $dbData = collect($validated)->except(['isDefault', 'address'])->toArray();
        $address->update($dbData);

        return response()->json([
            'error' => false,
            'data' => $address,
            'message' => 'Đã cập nhật địa chỉ thành công',
        ]);
    }

    public function destroy($id)
    {
        $address = Address::findOrFail($id);
        $address->delete();

        return response()->json([
            'error' => false,
            'message' => 'Đã xóa địa chỉ thành công',
        ]);
    }
}
