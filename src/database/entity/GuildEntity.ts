import { BaseEntity, Column, Entity, Index, PrimaryColumn } from "typeorm";
import CiGuildOptions from "../../typings";

@Entity()
export class GuildEntity extends BaseEntity {
  @Index()
  @PrimaryColumn("char", { length: 18 })
  id: string;

  @Column("simple-json")
  options: CiGuildOptions;
}
