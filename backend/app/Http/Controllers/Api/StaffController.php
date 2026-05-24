<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StaffController extends Controller
{
    public function loadStaff(Request $request)
    {
        $search = $request->input('search', '');

        $query = User::where('is_deleted', false)->orderBy('full_name', 'asc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'staff' => $query->get(),
        ], 200);
    }

    public function storeStaff(Request $request)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'max:100'],
            'username' => ['required', 'min:4', 'max:55', Rule::unique('tbl_users', 'username')],
            'password' => ['required', 'min:6', 'max:55', 'confirmed'],
            'role' => ['required', 'in:owner,staff'],
        ]);

        User::create([
            'full_name' => $validated['full_name'],
            'username' => $validated['username'],
            'password' => $validated['password'],
            'role' => $validated['role'],
        ]);

        return response()->json([
            'message' => 'Staff Successfully Saved.',
        ], 200);
    }

    public function updateStaff(Request $request, User $staff)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'max:100'],
            'username' => ['required', 'min:4', 'max:55', Rule::unique('tbl_users', 'username')->ignore($staff->user_id, 'user_id')],
            'password' => ['nullable', 'min:6', 'max:55', 'confirmed'],
            'role' => ['required', 'in:owner,staff'],
        ]);

        $data = [
            'full_name' => $validated['full_name'],
            'username' => $validated['username'],
            'role' => $validated['role'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = $validated['password'];
        }

        $staff->update($data);

        return response()->json([
            'message' => 'Staff Successfully Updated.',
            'staff' => $staff,
        ], 200);
    }

    public function destroyStaff(User $staff)
    {
        $staff->update(['is_deleted' => true]);

        return response()->json([
            'message' => 'Staff Successfully Deleted.',
        ], 200);
    }
}
