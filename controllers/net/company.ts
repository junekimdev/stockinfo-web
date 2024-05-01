import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { COMPANIES_URL } from '../apiURLs';
import { StateSearchInput } from '../data/states';
import { TypeCompany, TypeError } from '../data/types';

export const useGetCompanies = () => {
  const search_word = useRecoilValue(StateSearchInput);

  return useQuery({
    queryKey: ['company', search_word],
    queryFn: getCompanies,
    enabled: !!search_word,
    staleTime: Infinity,
    placeholderData: [],
  });
};

const getCompanies = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key, search_word] = queryKey;

  const url = `${COMPANIES_URL}/${encodeURIComponent(search_word)}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status === 404) {
    return [];
  }

  if (res.status >= 400) {
    const err: TypeError = await res.json();
    throw Error(err.message);
  }

  const data: TypeCompany[] = await res.json();

  return data;
};
