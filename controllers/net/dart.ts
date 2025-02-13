import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { DART_CODE_URL, DART_INDEX_URL, DART_STATEMENT_URL } from '../apiURLs';
import * as gType from '../data/types';

export const useGetDartCode = (stockCode: string) => {
  return useQuery({
    queryKey: ['dart', 'code', stockCode],
    queryFn: getDartCode,
    enabled: !!stockCode,
    staleTime: Infinity,
    placeholderData: '',
  });
};

export const useGetDartIndex = (
  dartCode: string,
  reportCode: gType.DartReportCode,
  indexCode: gType.DartIndexCode,
) => {
  return useQuery({
    queryKey: ['dart', 'index', dartCode, reportCode, indexCode],
    queryFn: getDartIndex,
    enabled: !!dartCode && !!reportCode && !!indexCode,
    staleTime: Infinity,
    placeholderData: { status: '', message: '', list: [] },
  });
};

export const useGetDartStatement = (
  dartCode: string,
  reportCode: gType.DartReportCode,
  statementCode: gType.DartStatementType,
) => {
  return useQuery({
    queryKey: ['dart', 'statement', dartCode, reportCode, statementCode],
    queryFn: getDartStatement,
    enabled: !!dartCode && !!reportCode && !!statementCode,
    staleTime: Infinity,
    placeholderData: { status: '', message: '', list: [] },
  });
};

const getDartCode = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key1, _key2, stockCode] = queryKey;

  const url = `${DART_CODE_URL}/${stockCode}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: gType.Error = await res.json();
    throw Error(err.message);
  }

  const data: string = await res.text();

  return data;
};

const getDartIndex = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key1, _key2, dartCode, reportCode, indexCode] = queryKey;

  const url = `${DART_INDEX_URL}/${dartCode}/${reportCode}/${indexCode}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: gType.Error = await res.json();
    throw Error(err.message);
  }

  const data: gType.DartRes = await res.json();

  return data;
};

const getDartStatement = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key1, _key2, dartCode, reportCode, statementCode] = queryKey;

  const url = `${DART_STATEMENT_URL}/${dartCode}/${reportCode}/${statementCode}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: gType.Error = await res.json();
    throw Error(err.message);
  }

  const data: gType.DartStatementRes = await res.json();

  return data;
};
