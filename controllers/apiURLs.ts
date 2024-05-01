export const placeholderUrl = 'https://jsonplaceholder.typicode.com/posts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export const COMPANIES_URL = API_URL + '/v1/companies';
export const PRICES_URL = API_URL + '/v1/prices';
export const DART_URL = API_URL + '/v1/dart';
export const DART_INDEX_URL = DART_URL + '/index';
export const DART_STATEMENT_URL = DART_URL + '/statement';

export const DART_VIEWER_LINK = 'https://dart.fss.or.kr/dsaf001/main.do?rcpNo=';

export const LOCAL_STORAGE_KEY_COMPANY_TABS = 'stockinfo-company-tabs';
export const LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS = 'stockinfo-recent-search-tabs';
