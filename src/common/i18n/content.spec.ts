import { localizeContent, translatedText } from './content';

/** A system exercise as it leaves CamelCaseInterceptor. */
function squat() {
  return {
    id: 'ex-1',
    name: 'Barbell Squat',
    instructions: 'Step one.\n\nStep two.',
    translations: {
      ro: {
        name: 'Genuflexiuni cu haltera',
        instructions: 'Primul pas.\n\nAl doilea pas.',
      },
    },
  };
}

describe('localizeContent', () => {
  it('answers a Romanian reader in Romanian and keeps the English name', () => {
    const out = localizeContent(squat(), 'ro');
    expect(out).toEqual({
      id: 'ex-1',
      name: 'Genuflexiuni cu haltera',
      originalName: 'Barbell Squat',
      instructions: 'Primul pas.\n\nAl doilea pas.',
    });
  });

  it('answers an English reader as before, without the translations', () => {
    const out = localizeContent(squat(), 'en');
    expect(out).toEqual({
      id: 'ex-1',
      name: 'Barbell Squat',
      instructions: 'Step one.\n\nStep two.',
    });
  });

  it('falls back to English field by field', () => {
    const row = {
      name: 'Plank',
      instructions: 'Hold it.',
      translations: { ro: { name: 'Plank lateral', instructions: '  ' } },
    };
    expect(localizeContent(row, 'ro')).toEqual({
      name: 'Plank lateral',
      originalName: 'Plank',
      instructions: 'Hold it.',
    });
  });

  it('adds no originalName when the name reads the same in both', () => {
    const row = {
      name: 'Hip thrust',
      translations: { ro: { name: 'Hip thrust' } },
    };
    expect(localizeContent(row, 'ro')).toEqual({ name: 'Hip thrust' });
  });

  it('never adds a field the query did not select', () => {
    const row = {
      id: 'ex-1',
      name: 'Barbell Squat',
      translations: { ro: { name: 'Genuflexiuni', instructions: 'Pași' } },
    };
    expect(localizeContent(row, 'ro')).not.toHaveProperty('instructions');
  });

  it('reaches nested rows and arrays: a plan, its exercises, their muscles', () => {
    const plan = {
      items: [
        {
          name: 'Push day',
          translations: { ro: { name: 'Zi de împins' } },
          workouts: [
            {
              exercises: [
                {
                  notes: 'Elbows in.',
                  translations: { ro: { notes: 'Coatele aproape de corp.' } },
                  exercise: {
                    ...squat(),
                    muscleRoles: [
                      {
                        muscle: {
                          commonName: 'Quadriceps',
                          translations: { ro: { commonName: 'Cvadricepși' } },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const out = localizeContent(plan, 'ro');
    const first = out.items[0];
    const px = first.workouts[0].exercises[0];
    expect(first.name).toBe('Zi de împins');
    expect(px.notes).toBe('Coatele aproape de corp.');
    expect(px.exercise.name).toBe('Genuflexiuni cu haltera');
    expect(px.exercise.muscleRoles[0].muscle.commonName).toBe('Cvadricepși');
    expect(JSON.stringify(out)).not.toContain('translations');
  });

  it('leaves a row without translations untouched, apart from the empty key', () => {
    const row = { name: 'My curl', translations: null };
    expect(localizeContent(row, 'ro')).toEqual({ name: 'My curl' });
  });

  it('passes through what is not a row: null, text, dates', () => {
    const at = new Date('2026-10-02T10:00:00Z');
    expect(localizeContent(null, 'ro')).toBeNull();
    expect(localizeContent('text', 'ro')).toBe('text');
    expect(localizeContent({ at }, 'ro')).toEqual({ at });
  });

  describe('a logged exercise name', () => {
    it('follows its translated exercise into the reader language', () => {
      const logged = {
        exerciseNameSnapshot: 'Barbell Squat',
        exercise: squat(),
      };
      expect(localizeContent(logged, 'ro').exerciseNameSnapshot).toBe(
        'Genuflexiuni cu haltera',
      );
    });

    it('reads in English for an English reader, even if logged in Romanian', () => {
      const logged = {
        exerciseNameSnapshot: 'Genuflexiuni cu haltera',
        exercise: squat(),
      };
      expect(localizeContent(logged, 'en').exerciseNameSnapshot).toBe(
        'Barbell Squat',
      );
    });

    it('stays as written for a coach exercise, even after a rename', () => {
      const logged = {
        exerciseNameSnapshot: 'Tempo squat',
        exercise: { name: 'Tempo squat 3-1-1', translations: null },
      };
      expect(localizeContent(logged, 'ro').exerciseNameSnapshot).toBe(
        'Tempo squat',
      );
    });

    it('stays as written when the log was read without its exercise', () => {
      const logged = { exerciseNameSnapshot: 'Barbell Squat', exercise: null };
      expect(localizeContent(logged, 'ro').exerciseNameSnapshot).toBe(
        'Barbell Squat',
      );
    });
  });
});

describe('translatedText', () => {
  it('picks the language, then falls back to the stored text', () => {
    const row = squat();
    expect(translatedText(row, 'name', 'ro')).toBe('Genuflexiuni cu haltera');
    expect(translatedText(row, 'name', 'en')).toBe('Barbell Squat');
    expect(
      translatedText({ name: 'Mine', translations: null }, 'name', 'ro'),
    ).toBe('Mine');
  });
});
