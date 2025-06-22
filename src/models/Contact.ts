import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({
  tableName: "contacts",
  timestamps: true,
})
export class Contact extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone_number?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message!: string;
}
