import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
} from "typeorm";
import { Length } from "class-validator";
import User from "./User";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "city", nullable: false })
    city: string;

    @Column({ name: "postal_code", width: 4 })
    postalCode: number;

    @Column({ name: "address_line", nullable: false })
    @Length(6, 255)
    addressLine: string;

    @ManyToOne((type) => User, (user) => user.addresses)
    user: User;

    @CreateDateColumn({ name: "create_date" })
    createDate: Date;

    @UpdateDateColumn({ name: "update_date" })
    updateDate: Date;

    @Column({ name: "is_active", default: true })
    isActive: boolean;
}

export default Address;
