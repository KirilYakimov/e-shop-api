import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    getManager,
} from "typeorm";
import { decode } from 'jsonwebtoken'
import { IsEmail, Length } from "class-validator";
import { RefreshToken } from "./RefreshToken";
import Address from "./Address";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "email", unique: true, nullable: false })
    @IsEmail()
    email: string;

    @Column({ name: "password", unique: true, nullable: false })
    password: string;

    @Column({ name: "first_name" })
    @Length(2, 45)
    firstName: string;

    @Column({ name: "last_name" })
    @Length(2, 45)
    lastName: string;

    @CreateDateColumn({ name: "create_date" })
    createDate: Date;

    @UpdateDateColumn({ name: "update_date" })
    cpdateDate: Date;

    @Column({ name: "is_active", default: true })
    isActive: boolean;

    @Column({ name: "is_admin", default: false })
    isAdmin: boolean;

    @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];

    @OneToMany((type) => Address, (address) => address.user)
    addresses: Address[];

    public static async fetchUserFromToken(token: string) {
        try {
            const decodedToken = decode(token);
            const user = getManager().getRepository(this).findOne({ id: decodedToken['id']})
            
            return user;
        } catch (error) {
            return null;
        }
    }
}

export default User;
