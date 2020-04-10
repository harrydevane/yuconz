export default class Review {
  public readonly id: number;
  public pastPerformance: string;
  public performanceSummary: string;
  public futurePerformance: string;
  public reviewerComments: string;
  public recommendation: string;
  public reviewee: any;
  public reviewer1: any;
  public reviewer2: any;
  public signatures: any;
  public state: string;

  constructor(id: number, pastPerformance: string, performanceSummary: string,
    futurePerformance: string, reviewerComments: string, recommendation: string,
    reviewee: any, reviewer1: any, reviewer2: any, signatures: string, state: string) {
    this.id = id;
    this.pastPerformance = pastPerformance;
    this.performanceSummary = performanceSummary;
    this.futurePerformance = futurePerformance;
    this.reviewerComments = reviewerComments;
    this.recommendation = recommendation;
    this.reviewee = reviewee;
    this.reviewer1 = reviewer1;
    this.reviewer2 = reviewer2;
    this.signatures = signatures;
    this.state = state;
  }
}
