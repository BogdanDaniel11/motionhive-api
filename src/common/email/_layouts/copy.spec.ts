import { emailCopy } from './copy';

describe('emailCopy', () => {
  const en = emailCopy('en', 'email.auth.welcome');
  const ro = emailCopy('ro', 'email.auth.welcome');

  it('renders the same part in each language', () => {
    expect(en.text('heading', { name: 'Ana' })).toBe('Welcome, Ana!');
    expect(ro.text('heading', { name: 'Ana' })).toBe('Bine ai venit, Ana!');
  });

  it('html() escapes the copy and the values interpolated into it', () => {
    const html = en.html('heading', { name: '<img src=x onerror=1> & co' });
    expect(html).toBe('Welcome, &lt;img src=x onerror=1&gt; &amp; co!');
  });

  it('html() escapes the apostrophes the copy itself contains', () => {
    expect(en.html('intro')).toContain('Here&#39;s what you can do:');
  });

  it('turns **bold** into <strong> in html and drops it in text', () => {
    expect(en.html('featureSessions')).toMatch(
      /^<strong>Join sessions\.<\/strong> Find/,
    );
    expect(en.text('featureSessions')).toMatch(/^Join sessions\. Find/);
    expect(ro.text('featureSessions')).not.toContain('*');
  });

  it('a value cannot smuggle markup in through the bold marker', () => {
    const html = en.html('heading', { name: '**<b>x</b>**' });
    expect(html).toBe('Welcome, <strong>&lt;b&gt;x&lt;/b&gt;</strong>!');
  });
});
