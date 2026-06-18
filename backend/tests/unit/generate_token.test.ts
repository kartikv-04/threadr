import { generateToken } from '../../src/helper/utility.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { ACCESS_SECRET, REFRESH_SECRET } from '../../src/config/env.js';
import mongoose from 'mongoose';

// Check token generetion test
describe('Generte Token', () => {
  test('Generate Two token and verify with secrets', () => {
    const userId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

    const token = generateToken(userId);

    // Check all cases and
    expect(typeof token).toBe('object');

    // compare generated token and useID inside with comparing it with here
    const first_Token = jwt.verify(token.accessToken, ACCESS_SECRET) as JwtPayload;
    const second_Token = jwt.verify(token.refreshToken, REFRESH_SECRET) as JwtPayload;

    // Check if body or obj does contains tokens
    expect(token).toHaveProperty('accessToken');
    expect(token).toHaveProperty('refreshToken');

    expect(first_Token.id.toString()).toBe(String(userId));
    expect(second_Token.id.toString()).toBe(String(userId));
  });
});
