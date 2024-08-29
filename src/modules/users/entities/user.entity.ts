import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuarios' })
export class EUser {
  @PrimaryGeneratedColumn()
  IdUsuario: number;

  @Column({ nullable: false })
  CardName: string;

  @Column({ nullable: false })
  E_Mail: string;

  @Column({ nullable: false })
  CardCode: string;

  @Column({ nullable: false })
  Username: string;

  @Column({ nullable: false, select: false })
  Password: string;

  @Column({ nullable: true })
  Role: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;

  @Column({ nullable: true })
  UpdateAt: Date;

  @Column({ nullable: true })
  DesactivatedAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  LastLogin: Date;

  @Column({ default: true })
  AuthStrategy: boolean;

  @Column({ default: true })
  Active: boolean;
}
