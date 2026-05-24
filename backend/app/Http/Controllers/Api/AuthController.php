<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => ['required', 'min:4', 'max:55'],
            'password' => ['required', 'min:6', 'max:55'],
        ]);

        $user = User::where('username', $validated['username'])
            ->where('is_deleted', false)
            ->first();

        if (!$user || !Auth::attempt([
            'username' => $validated['username'],
            'password' => $validated['password'],
        ])) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.',
            ], 401);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged Out Successfully',
        ], 200);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if ($user->is_deleted) {
            $user->tokens()->delete();

            return response()->json(['message' => 'Account is no longer active.'], 401);
        }

        return response()->json([
            'user' => $user,
        ], 200);
    }
}
