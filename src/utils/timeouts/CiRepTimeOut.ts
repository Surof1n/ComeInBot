export class CiRepTimeout {
  public activeTimeOutReputation: NodeJS.Timeout;
  constructor() {
    this.activeTimeOutReputation;
  }

  public _init() {
    this.activeTimeOutReputation = setInterval(() => {
      console.log(1);
    }, 360000);
  }
}
