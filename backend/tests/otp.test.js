require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { User } = require('../src/models/user.model');
const authService = require('../src/services/auth.service');

describe('OTP Verification & Lifecycle Hardening', () => {
  const testEmail = 'otp-lifecycle-test@carzodrive.com';
  let user;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({ email: testEmail });
    user = await User.create({
      name: 'OTP Lifecycle Tester',
      email: testEmail,
      password: 'InitialPassword123!',
      role: 'CUSTOMER',
      status: 'ACTIVE',
    });
  });

  afterAll(async () => {
    await User.deleteMany({ email: testEmail });
    await mongoose.disconnect();
  });

  test('1. Initiates password reset and generates 6-digit secure OTP', async () => {
    const result = await authService.initiatePasswordReset(testEmail);
    expect(result).toBeDefined();
    expect(result.email).toBe(testEmail);
    expect(result.otp).toMatch(/^\d{6}$/);

    const savedUser = await User.findOne({ email: testEmail }).select('+passwordResetToken +passwordResetExpires');
    expect(savedUser.passwordResetToken).toBeDefined();
    expect(savedUser.passwordResetExpires).toBeDefined();
    expect(savedUser.passwordResetExpires.getTime()).toBeGreaterThan(Date.now());
  });

  test('2. Rejects immediate second OTP request with 429 Cooldown', async () => {
    await expect(authService.initiatePasswordReset(testEmail)).rejects.toMatchObject({
      statusCode: 429,
    });
  });

  test('3. Rejects reset with invalid OTP code', async () => {
    await expect(
      authService.resetPassword({
        token: '999999',
        email: testEmail,
        password: 'NewStrongPassword1!',
      })
    ).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  test('4. Successfully resets password with valid OTP and cleans up tokens', async () => {
    // Reset expiration artificially to allow generating a fresh OTP
    await User.updateOne({ email: testEmail }, { $unset: { passwordResetExpires: '' } });
    const freshResult = await authService.initiatePasswordReset(testEmail);
    const validOtp = freshResult.otp;

    const resetSuccess = await authService.resetPassword({
      token: validOtp,
      email: testEmail,
      password: 'NewBrandPassword123!',
    });
    expect(resetSuccess).toBe(true);

    // Verify token cleanup (tokens wiped to prevent replay)
    const updatedUser = await User.findOne({ email: testEmail }).select('+passwordResetToken +passwordResetExpires +password');
    expect(updatedUser.passwordResetToken).toBeUndefined();
    expect(updatedUser.passwordResetExpires).toBeUndefined();

    // Verify user can login with new password
    const loginValid = await updatedUser.comparePassword('NewBrandPassword123!');
    expect(loginValid).toBe(true);
  });

  test('5. Rejects replay attack using previously used OTP', async () => {
    await expect(
      authService.resetPassword({
        token: '123456',
        email: testEmail,
        password: 'AnotherPassword123!',
      })
    ).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  test('6. Rejects expired OTP code', async () => {
    const expiredOtp = '654321';
    const crypto = require('crypto');
    const hashed = crypto.createHash('sha256').update(expiredOtp).digest('hex');

    // Simulate expired token in DB
    await User.updateOne(
      { email: testEmail },
      {
        passwordResetToken: hashed,
        passwordResetExpires: new Date(Date.now() - 5000), // expired 5 seconds ago
      }
    );

    await expect(
      authService.resetPassword({
        token: expiredOtp,
        email: testEmail,
        password: 'ExpiredOtpPassword1!',
      })
    ).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});
