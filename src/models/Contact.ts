import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "contacts",
  timestamps: true,
})
export class Contact extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare phone_number: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare message: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare status: 1 | 2 | 3;
}
