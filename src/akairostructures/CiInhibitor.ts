import { CiClient } from '@structures';
import { Inhibitor } from 'discord-akairo';

export class CiInhibitor extends Inhibitor {
  public declare client: CiClient;
}
