import { Column, DataType, Model, Table } from 'sequelize-typescript';

// User model (table) that will be created in our PostgresSQL database through sequelize orm 
@Table
export class User extends Model {

    // UserID is a UUID which takes random UUID as default value and primary key for this model
    @Column({primaryKey: true , type: DataType.UUID ,defaultValue: DataType.UUIDV4})
    userID: string;
    
    // username is a unique string attribute that can't be null 
    @Column({unique: true , allowNull: false , type: DataType.STRING})
    username: string;
    
    // Password is a string attribute that can't be null 
    @Column({ allowNull: false , type: DataType.STRING})
    password: string;
    
    // role is string attribute that can't be null and only takes 2 values "admin" , "client" 
    @Column({ allowNull: false , type: DataType.STRING ,values: ["client" , "admin"] })
    role: string;
    
    // isBlocked is a boolean that can't be null and set to false by default 
    @Column({ allowNull: false , type: DataType.BOOLEAN, defaultValue: false })  
    isBlocked: boolean; 
}