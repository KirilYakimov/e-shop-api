import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from "typeorm";
import User from "./User";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne((type) => User, (user) => user.refreshTokens)
    user: User;
    
    @Column({ name: "jwt_id" })
    jwtId: string;

    @Column({ name: "is_active", default: false })
    isActive: boolean;

    @Column({ name: "expiry_date" })
    expiryDate: Date;

    @CreateDateColumn({ name: "create_date" })
    CreateDate: Date;

    @UpdateDateColumn({ name: "update_date" })
    UpdateDate: Date;

}

export default RefreshToken;
