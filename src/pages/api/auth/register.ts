import type { APIRoute } from 'astro';
import { UsersDB } from '../../../lib/db';
import { sendVerificationEmail } from '../../../lib/email';
import crypto from 'crypto';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { name, email } = body;

    if (!email || !name) {
      return new Response(JSON.stringify({ success: false, error: 'Nama dan email wajib diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const existing = await UsersDB.getByEmailAsync(email);
    if (existing) {
      return new Response(JSON.stringify({ success: false, error: 'Email sudah terdaftar. Silakan masuk.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const verificationToken = crypto.randomUUID();
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = UsersDB.create({
      name,
      email,
      role: 'Gratis',
      status: 'pending',
      isVerified: false,
      verificationToken,
      verificationExpires,
      quota: 15,
      projectsCount: 0,
      authProvider: 'email'
    });

    const origin = new URL(request.url).origin;
    const verificationUrl = `${origin}/verify-email?token=${verificationToken}`;

    const emailResult = await sendVerificationEmail({
      to: email,
      name,
      verificationUrl
    });

    return new Response(JSON.stringify({
      success: true,
      requiresVerification: true,
      message: 'Pendaftaran berhasil! Kami telah mengirimkan email verifikasi ke alamat Anda.',
      emailSent: emailResult.success,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        quota: user.quota
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Gagal mendaftarkan akun.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
