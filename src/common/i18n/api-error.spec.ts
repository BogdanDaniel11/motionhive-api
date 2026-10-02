import {
  apiError,
  isApiErrorBody,
  renderApiError,
  requestLocale,
  validationErrorBody,
} from './api-error';

describe('apiError', () => {
  it('carries the key, the params and the English rendering', () => {
    expect(apiError('venue.notFound')).toEqual({
      message: 'Venue not found.',
      messageKey: 'venue.notFound',
    });
  });

  it('renders the same error in each language', () => {
    const body = apiError('venue.cityRequired');
    expect(renderApiError(body, 'en')).toBe(
      'Add a city for an in-person venue.',
    );
    expect(renderApiError(body, 'ro')).toBe(
      'Adaugă orașul pentru o locație fizică.',
    );
  });

  it('recognises only bodies that name a real message', () => {
    expect(isApiErrorBody(apiError('venue.notFound'))).toBe(true);
    expect(isApiErrorBody({ message: 'x', messageKey: 'venue.gone' })).toBe(
      false,
    );
    expect(isApiErrorBody({ statusCode: 404, message: 'Not Found' })).toBe(
      false,
    );
    expect(isApiErrorBody('Venue not found.')).toBe(false);
  });
});

describe('requestLocale', () => {
  const req = (header?: string, language?: string) => ({
    headers: header ? { 'accept-language': header } : {},
    user: language ? { language } : undefined,
  });

  it('answers in the language the app sends', () => {
    expect(requestLocale(req('ro'))).toBe('ro');
    expect(requestLocale(req('ro-RO,ro;q=0.9,en;q=0.8'))).toBe('ro');
  });

  it('skips languages it does not speak, in order', () => {
    expect(requestLocale(req('fr-FR,ro;q=0.8'))).toBe('ro');
  });

  it('falls back to the account language, then English', () => {
    expect(requestLocale(req(undefined, 'ro'))).toBe('ro');
    expect(requestLocale(req('fr'))).toBe('en');
    expect(requestLocale(req())).toBe('en');
  });

  it('lets the app language win over the saved one', () => {
    expect(requestLocale(req('en', 'ro'))).toBe('en');
  });
});

describe('validationErrorBody', () => {
  it('answers a generic rule with one translated sentence, keeping the raw messages', () => {
    const body = validationErrorBody([
      {
        constraints: {
          minLength: 'title must be longer than or equal to 3 characters',
        },
      },
    ]);
    expect(body.messageKey).toBe('common.invalidInput');
    expect(renderApiError(body, 'ro')).toBe(
      'Unele câmpuri nu sunt completate corect. Verifică-le și încearcă din nou.',
    );
    expect(body.details).toEqual([
      'title must be longer than or equal to 3 characters',
    ]);
  });

  it('uses the message a DTO named, even inside nested objects', () => {
    const body = validationErrorBody([
      {
        children: [
          {
            constraints: {
              isNotEmpty: 'name should not be empty',
              match: 'errors.validation.passwordsDoNotMatch',
            },
          },
        ],
      },
    ]);
    expect(body.messageKey).toBe('validation.passwordsDoNotMatch');
    expect(renderApiError(body, 'ro')).toBe('Parolele nu se potrivesc.');
    expect(body.details).toContain('Passwords do not match.');
  });
});
