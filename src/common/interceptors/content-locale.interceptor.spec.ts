import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom, of } from 'rxjs';
import { ContentLocaleInterceptor } from './content-locale.interceptor';

const row = () => ({
  name: 'Barbell Squat',
  translations: { ro: { name: 'Genuflexiuni cu haltera' } },
});

function run(
  request: { headers?: Record<string, string>; user?: { language?: string } },
  raw = false,
) {
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(raw),
  } as unknown as Reflector;
  const context = {
    getType: () => 'http',
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  const next: CallHandler = { handle: () => of(row()) };
  return lastValueFrom(
    new ContentLocaleInterceptor(reflector).intercept(context, next),
  );
}

describe('ContentLocaleInterceptor', () => {
  it('answers in the language the app sends', async () => {
    await expect(
      run({ headers: { 'accept-language': 'ro' }, user: { language: 'en' } }),
    ).resolves.toMatchObject({ name: 'Genuflexiuni cu haltera' });
  });

  it('falls back to the account language', async () => {
    await expect(run({ user: { language: 'ro' } })).resolves.toMatchObject({
      name: 'Genuflexiuni cu haltera',
    });
  });

  it('answers in English when nothing says otherwise', async () => {
    await expect(run({})).resolves.toEqual({ name: 'Barbell Squat' });
  });

  it('leaves admin responses as stored', async () => {
    await expect(
      run({ headers: { 'accept-language': 'ro' } }, true),
    ).resolves.toEqual(row());
  });
});
