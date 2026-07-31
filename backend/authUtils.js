import passport from 'passport';
import bcrypt from 'bcryptjs';
import { Strategy as LocalStrategy } from 'passport-local';
import { prisma } from './lib/prisma.js';
import { Strategy, ExtractJwt } from 'passport-jwt'

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new Strategy(opts, async function (jwt_payload, done) {
  try {
    const user = await prisma.users.findUnique({ where: { id: jwt_payload.id }, omit: { password: true } });

    if (!user) {
      return done(new Error("User not found!"), false);
    }

    if (user) {
      return done(null, user);
    }

  } catch (error) {
    return done(error, false)
  }
}));

export { passport }