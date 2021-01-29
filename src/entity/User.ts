import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsEmail, Length } from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name" })
    @Length(3, 45)
    name: string;

    @Column({ name: "email" })
    @IsEmail()
    email: string;

    @Column({ name: "password" })
    @Length(6, 255)
    password: string;

    @CreateDateColumn({ name: "create_date" })
    CreateDate: Date;

    @UpdateDateColumn({ name: "update_date" })
    UpdateDate: Date;

    @Column({ name: "is_active" })
    isActive: number;
}

export default User;
