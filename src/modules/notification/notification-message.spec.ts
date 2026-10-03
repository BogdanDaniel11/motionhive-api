import {
  renderNotificationMessage,
  renderStoredNotification,
} from './notification-message';

describe('renderNotificationMessage', () => {
  it('renders title and body in the requested language', () => {
    const message = {
      key: 'client.invitationReceived' as const,
      params: { name: 'Dan Ionescu' },
    };
    expect(renderNotificationMessage(message, 'en')).toEqual({
      title: 'Coaching invitation',
      body: 'Dan Ionescu invited you to become their client.',
      cta: null,
      locale: 'en',
    });
    expect(renderNotificationMessage(message, 'ro')).toEqual({
      title: 'Invitație de la un antrenor',
      body: 'Dan Ionescu îți propune să te antreneze.',
      cta: null,
      locale: 'ro',
    });
  });
});

describe('renderStoredNotification', () => {
  const english = { title: 'Invoice paid', body: 'Your invoice was paid' };

  it("renders a keyed row in the reader's language", () => {
    const row = {
      title: 'Coaching ended',
      body: 'Ana ended the coaching relationship.',
      messageKey: 'client.relationshipEnded',
      messageParams: { name: 'Ana' },
    };
    expect(renderStoredNotification(row, 'ro')).toMatchObject({
      title: 'Un client a renunțat',
      body: 'Ana nu se mai antrenează cu tine.',
      locale: 'ro',
    });
  });

  it('keeps the stored English text for a row with no key', () => {
    const row = { ...english, messageKey: null, messageParams: null };
    expect(renderStoredNotification(row, 'ro')).toEqual({
      ...english,
      cta: null,
      locale: 'en',
    });
  });

  it('keeps the stored English text when the key no longer exists', () => {
    const row = {
      ...english,
      messageKey: 'client.renamedAway',
      messageParams: { name: 'Ana' },
    };
    expect(renderStoredNotification(row, 'ro')).toEqual({
      ...english,
      cta: null,
      locale: 'en',
    });
  });
});
