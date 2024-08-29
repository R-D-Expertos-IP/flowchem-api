import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'productos' })
export class EProduct {
  @PrimaryGeneratedColumn()
  IdProducto: number;

  @Column({ unique: true, nullable: false })
  Dscription: string;

  @Column({ unique: true, nullable: false })
  ItemCode: string;

  @Column({ nullable: false, select: false })
  Image: string;

  @Column()
  certificateUrl: string;

  @Column()
  safetySheetUrl: string;

  @Column()
  technicalSheetUrl: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;

  @Column({ nullable: true })
  UpdateAt: Date;

  @Column({ nullable: true })
  DesactivatedAt: Date;

  @Column({ default: true })
  Active: boolean;
}
