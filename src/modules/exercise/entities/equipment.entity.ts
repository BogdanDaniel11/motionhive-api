import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import type { ContentTranslations } from '../../../common/i18n';

/**
 * Equipment Entity
 *
 * Reference taxonomy seeded inline by migration 047 (~15 rows: barbell,
 * dumbbell, kettlebell, cable, machine, smith_machine, bodyweight,
 * bands, medicine_ball, exercise_ball, foam_roller, ez_bar, bench,
 * pull_up_bar, other).
 *
 * Joined to `exercise` via `exercise_equipment` (M2M, no extras).
 */
@Table({
  tableName: 'equipment',
  timestamps: true,
  underscored: true,
})
export class Equipment extends Model {
  @Column({
    type: DataType.CHAR(36),
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  declare slug: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: 0 })
  declare displayOrder: number;

  /**
   * Other languages of name, on MotionHive's own rows only
   * (migration 063). Swapped in per reader by ContentLocaleInterceptor;
   * never accepted from a request.
   */
  @Column({ type: DataType.JSONB, allowNull: true })
  declare translations: ContentTranslations | null;

  @CreatedAt declare createdAt: Date;
  @UpdatedAt declare updatedAt: Date;
}
