interface pagination {
  next: string | null;
  prev: string | null;
  count: number;
}

interface request {
  contentType: string;
  format: string;
}

export interface DataGovMembersResponse {
  members: {
    bioguideId: string;
    depiction: {
      attribution: string;
      imageUrl: string;
    };
    name: string;
    partyName: string;
    state: string;
    terms: {
      item: {
        chamber: string;
        endYear: number;
        startYear: number;
      }[];
    };
    updateDate: string;
    url: string;
  }[];
  pagination: pagination;
  request: request;
}
