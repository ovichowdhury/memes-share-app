import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import {Image} from './image.entity';


@Entity()
export class User {
    // primary key
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // username 
    @Column({length: 255, unique: true})
    username: string;


    // password 
    @Column({length: 255, select: false})
    password: string;
    

    // create date
    @CreateDateColumn()
    createDate: Date;

    /**
     * Relationship with other entity
     */
    @OneToMany(type => Image, image => image.user)
    images: Image[];



}