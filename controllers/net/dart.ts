import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { DART_INDEX_URL, DART_STATEMENT_URL, DART_URL } from '../apiURLs';
import {
  TypeDartIndexCode,
  TypeDartReportCode,
  TypeDartRes,
  TypeDartStatementRes,
  TypeDartStatementType,
  TypeError,
} from '../data/types';

export const useGetDartCode = (name: string) => {
  return useQuery({
    queryKey: ['dart', 'code', name],
    queryFn: getDartCode,
    enabled: !!name,
    staleTime: Infinity,
    placeholderData: '',
  });
};

export const useGetDartIndex = (
  dartCode: string,
  reportCode: TypeDartReportCode,
  indexCode: TypeDartIndexCode,
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
  reportCode: TypeDartReportCode,
  statementCode: TypeDartStatementType,
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
  const [_key1, _key2, name] = queryKey;

  const url = `${DART_URL}/${encodeURIComponent(name)}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: TypeError = await res.json();
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
    const err: TypeError = await res.json();
    throw Error(err.message);
  }

  const data: TypeDartRes = await res.json();

  return data;
};

const getDartStatement = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key1, _key2, dartCode, reportCode, statementCode] = queryKey;

  const url = `${DART_STATEMENT_URL}/${dartCode}/${reportCode}/${statementCode}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: TypeError = await res.json();
    throw Error(err.message);
  }

  const data: TypeDartStatementRes = await res.json();

  return data;
};
