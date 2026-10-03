import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * @Match(property) — cross-field equality validator.
 *
 * Validates that the decorated field equals the value of another field
 * on the same object. Typical use: confirmPassword must equal password.
 *
 * @example
 * @Match('password', { message: 'errors.validation.passwordsDoNotMatch' })
 * confirmPassword: string;
 */
export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as [string];
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];
          return value === relatedValue;
        },
        // A catalog key: the ValidationPipe answers with its translation.
        // Name a more specific one with `message` (passwords do).
        defaultMessage() {
          return 'errors.validation.valuesDoNotMatch';
        },
      },
    });
  };
}
