interface pagination {
  next: string | null;
  prev: string | null;
  count: number;
}

interface request {
  contentType: string;
  format: string;
}

/*
 bill: {
    actions: {
      count: 3,
      url: 'https://api.congress.gov/v3/bill/116/s/129/actions?format=json'
    },
    committees: {
      count: 1,
      url: 'https://api.congress.gov/v3/bill/116/s/129/committees?format=json'
    },
    congress: 116,
    cosponsors: {
      count: 1,
      countIncludingWithdrawnCosponsors: 1,
      url: 'https://api.congress.gov/v3/bill/116/s/129/cosponsors?format=json'
    },
    introducedDate: '2019-01-15',
    latestAction: {
      actionDate: '2020-09-16',
      text: 'Committee on Energy and Natural Resources Subcommittee on Public Lands, Forests, and Mining. Hearings held. With printed Hearing: S.Hrg. 116-380.'
    },
    number: '129',
    originChamber: 'Senate',
    originChamberCode: 'S',
    policyArea: { name: 'Water Resources Development' },
    relatedBills: {
      count: 2,
      url: 'https://api.congress.gov/v3/bill/116/s/129/relatedbills?format=json'
    },
    sponsors: [ [Object] ],
    subjects: {
      count: 9,
      url: 'https://api.congress.gov/v3/bill/116/s/129/subjects?format=json'
    },
    summaries: {
      count: 1,
      url: 'https://api.congress.gov/v3/bill/116/s/129/summaries?format=json'
    },
    textVersions: {
      count: 1,
      url: 'https://api.congress.gov/v3/bill/116/s/129/text?format=json'
    },
    title: 'Saint Francis Dam Disaster National Memorial Act',
    titles: {
      count: 3,
      url: 'https://api.congress.gov/v3/bill/116/s/129/titles?format=json'
    },
    type: 'S',
    updateDate: '2024-02-16T15:50:25Z',
    updateDateIncludingText: '2024-02-16T15:50:25Z'
  },
  request: {
    billNumber: '129',
    billType: 's',
    congress: '116',
    contentType: 'application/json',
    format: 'json'
  }
}
*/

export interface Bill {
  actions: {
    count: number;
    url: string;
  };
  committees: {
    count: number;
    url: string;
  };
  congress: number;
  cosponsors: {
    count: number;
    url: string;
  };
  introducedDate: string;
  latestAction: {
    actionDate: string;
    text: string;
  };
  number: string;
  originChamber: string;
  originChamberCode: string;
  policyArea: {
    name: string;
  };
  relatedBills: {
    count: number;
    url: string;
  };
  sponsors: any[];
  subjects: {
    count: number;
    url: string;
  };
  summaries: {
    count: number;
    url: string;
  };
  textVersions: {
    count: number;
    url: string;
  };
  titles: {
    count: number;
    url: string;
  };
  type: string;
  updateDate: string;
  updateDateIncludingText: string;
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
