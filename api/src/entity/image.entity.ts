import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { User } from "./user.entity";



@Entity()
export class Image {
    // primary key
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    // username 
    @Column({type: "bytea"})
    data: Buffer;

    @Column()
    mimeType: string;

    @Column()
    views: number;

    @Column()
    likes: number;

    @Column()
    blockedRequests: number;

    @Column("simple-array", {nullable: true})
    allowList: string[];

    @Column({nullable: true})
    deleteAfter: number;
    
    

    // create date
    @CreateDateColumn({
        type: "timestamptz"
    })
    createDate: Date;

    /**
     * Relationship with other entity
     */
    @ManyToOne(type => User, user => user.images)
    user: User;



}