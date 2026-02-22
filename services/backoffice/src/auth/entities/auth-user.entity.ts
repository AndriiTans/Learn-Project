import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'auth_users' })
export class AuthUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  cognitoSub: string;

  @Column({ nullable: true })
  email: string | null;

  @Column({ nullable: true })
  username: string | null;

  @Column({ nullable: true })
  tokenUse: string | null;

  @Column({ type: 'simple-array', default: '' })
  groups: string[];

  @Column({ type: 'timestamptz' })
  lastAuthenticatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
