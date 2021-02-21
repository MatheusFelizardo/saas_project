import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, } from 'typeorm'
import bcrypt from 'bcryptjs'

@Entity('users')
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    name: string;
    
    @Column()
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    @Column('timestamp')
    created_at: string;

    @Column('timestamp')
    updated_at: string;
}

export default User;