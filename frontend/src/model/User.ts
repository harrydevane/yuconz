import Address from './Address';
import Review from './Review';

export default class User {
  public readonly id: string;
  public password: string;
  public firstName: string;
  public lastName: string;
  public dateOfBirth: Date;
  public address: Address;
  public telephoneNumber: string;
  public mobileNumber: string;
  public emergencyContact: string;
  public emergencyContactNumber: string;
  public section: string;
  public role: string;
  public authenticationRole: string;
  public review: Review;
  public reviewingReviews: Array<any>;
  public enabled: boolean;

  constructor(id: string, password: string, firstName: string, lastName: string, dateOfBirth: Date,
    address: Address, telephoneNumber: string, mobileNumber: string, emergencyContact: string,
    emergencyContactNumber: string, section: string, role: string, authenticationRole: string, review: Review, reviewingReviews: Array<any>, enabled: boolean) {
    this.id = id;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.address = address;
    this.telephoneNumber = telephoneNumber;
    this.mobileNumber = mobileNumber;
    this.emergencyContact = emergencyContact;
    this.emergencyContactNumber = emergencyContactNumber;
    this.section = section;
    this.role = role;
    this.authenticationRole = authenticationRole;
    this.review = review;
    this.reviewingReviews = reviewingReviews;
    this.enabled = enabled;
  }
}
