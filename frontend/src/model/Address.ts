export default class Address {
  public line1: string;
  public line2: string;
  public town: string;
  public county: string;
  public postcode: string;

  constructor(line1: string, line2: string, town: string, county: string, postcode: string) {
    this.line1 = line1;
    this.line2 = line2;
    this.town = town;
    this.county = county;
    this.postcode = postcode;
  }
}
