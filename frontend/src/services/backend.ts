import axios from 'axios';

import Address from '../model/Address';
import Review from '../model/Review';
import User from '../model/User';

class BackendService {
  /* User */
  async login(id: string, password: string, role: string): Promise<User> {
    const response = await axios.post('http://localhost:8080/api/login', { id, password, role }, { withCredentials: true });
    return this.deserializeUser(response.data);
  }

  async logout(): Promise<void> {
    await axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true });
  }

  async createUser(user: User): Promise<void> {
    await axios.post('http://localhost:8080/api/user', user, { withCredentials: true });
  }

  async updateUser(user: User): Promise<void> {
    await axios.put('http://localhost:8080/api/user', user, { withCredentials: true });
  }

  async getUser(): Promise<User> {
    const response = await axios.get('http://localhost:8080/api/user', { withCredentials: true });
    return this.deserializeUser(response.data);
  }

  async getUsers(start: number, end: number): Promise<Array<User>> {
    const response = await axios.get('http://localhost:8080/api/users', { params: { start, end }, withCredentials: true });
    const users = [];
    for (const user of response.data) {
      users.push(this.deserializeBasicUser(user));
    }
    return users;
  }

  async getTotalUsers(): Promise<number> {
    const response = await axios.get('http://localhost:8080/api/totalusers', { withCredentials: true });
    return response.data;
  }

  /* Records */
  async getRecords(userId: string): Promise<Array<Review>> {
    const response = await axios.get('http://localhost:8080/api/records', { params: { userId }, withCredentials: true });
    const reviews = new Array<Review>();
    for (const review of response.data) {
      reviews.push(this.deserializeReview(review));
    }
    return reviews;
  }

  /* Reviews */
  async initiateReview(revieweeId: string, reviewer1Id: string, reviewer2Id: string): Promise<void> {
    await axios.post('http://localhost:8080/api/review', { revieweeId, reviewer1Id, reviewer2Id }, { withCredentials: true });
  }

  async updateReview(review: Review): Promise<void> {
    await axios.put('http://localhost:8080/api/review', review, { withCredentials: true });
  }

  async signReview(reviewId: number): Promise<void> {
    await axios.post('http://localhost:8080/api/signreview', { reviewId }, { withCredentials: true });
  }

  async getUsersPendingReview(): Promise<any> {
    const response = await axios.get('http://localhost:8080/api/userspendingreview', { withCredentials: true });
    return response.data;
  }

  async getUncompletedReviews(): Promise<any> {
    const response = await axios.get('http://localhost:8080/api/review', { withCredentials: true });
    return response.data;
  }

  /* Helper Functions */
  deserializeReview(data: any): Review {
    if (!data) {
      return undefined;
    }
    return new Review(
      data.id, data.pastPerformance, data.performanceSummary,
      data.futurePerformance, data.reviewerComments, data.recommendation,
      data.reviewee, data.reviewer1, data.reviewer2, data.signatures, data.state,
    );
  }

  deserializeUser(data: any): User {
    const { user } = data;
    const { authenticationRole } = data;
    const review = this.deserializeReview(data.review);
    const { reviewingReviews } = data;
    const addressData = user.address;
    return new User(user.id, user.password, user.firstName, user.lastName, new Date(user.dateOfBirth),
      new Address(addressData.line1, addressData.line2, addressData.town, addressData.county, addressData.postcode),
      user.telephoneNumber, user.mobileNumber, user.emergencyContact, user.emergencyContactNumber, user.section, user.role, authenticationRole, review, reviewingReviews, user.enabled);
  }

  deserializeBasicUser(data: any): User {
    const addressData = data.address;
    return new User(data.id, data.password, data.firstName, data.lastName, new Date(data.dateOfBirth),
      new Address(addressData.line1, addressData.line2, addressData.town, addressData.county, addressData.postcode),
      data.telephoneNumber, data.mobileNumber, data.emergencyContact, data.emergencyContactNumber, data.section, data.role, undefined, undefined, undefined, true);
  }
}

export default new BackendService();
