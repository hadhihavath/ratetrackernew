export interface CuelinksConfig {
  publisherCid: string;
  apiKey: string;
  v3BaseUrl: string;
  redirectBaseUrl: string;
}

export interface CuelinksCampaign {
  id: string;
  campaign: string;
  title: string;
  discount: string;
  couponCode?: string;
  category: string;
  tag: string;
  directUrl: string;
  trackingUrl: string;
  image: string;
  endsIn: string;
  price?: number;
  origPrice?: number;
}

export interface CuelinksOffersResponse {
  offers: CuelinksCampaign[];
}

export interface CuelinksStatusResponse {
  connected: boolean;
  publisherCid: string;
  status: string;
  note?: string;
}

export interface CuelinksRedirectResponse {
  originalUrl: string;
  publisherCid: string;
  trackingUrl: string;
}

export interface CuelinksRedirectRequest {
  url: string;
  subid?: string;
  redirect?: boolean;
}