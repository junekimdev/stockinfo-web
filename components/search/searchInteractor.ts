import { useAtom, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS } from '../../controllers/apiURLs';
import {
  StateCompanyTabs,
  StateCurrentTab,
  StateRecentSearchTabs,
  StateSearchInput,
} from '../../controllers/data/states';
import { TypeCompany, TypeCompanyTab } from '../../controllers/data/types';

export const useSearchInputChange = () => {
  const setState = useSetAtom(StateSearchInput);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState(e.currentTarget.value);
    },
    [setState],
  );
};

export const useCompanyClick = (uuid: string, company: TypeCompany) => {
  const [companyTabs, setCompanyTabs] = useAtom(StateCompanyTabs);
  const [recentSearchTabs, setRecentSearchTabs] = useAtom(StateRecentSearchTabs);
  const setCurrentTab = useSetAtom(StateCurrentTab);
  const resetSearchInput = useResetAtom(StateSearchInput);
  const router = useRouter();

  return useCallback(() => {
    const tabExists: TypeCompanyTab = companyTabs.reduce(
      (p, v) => (v.company.srtnCd === company.srtnCd ? v : p),
      { uuid: '', company, mainType: 'daily' },
    );

    // Add to tabs and set it as current
    const tab: TypeCompanyTab = tabExists.uuid ? tabExists : { uuid, company, mainType: 'daily' };
    if (!tabExists.uuid) setCompanyTabs([tab, ...companyTabs]);
    setCurrentTab(tab);
    resetSearchInput();

    // Add to recent search tabs
    const saved = recentSearchTabs.reduce(
      (p, v) => p || v.company.srtnCd === tab.company.srtnCd,
      false,
    );
    if (!saved) {
      const recent = [...recentSearchTabs.slice(-3), tab];
      setRecentSearchTabs(recent);
      window.localStorage.setItem(LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS, JSON.stringify(recent));
    }

    router.push('/chart');
  }, [
    setCompanyTabs,
    setCurrentTab,
    resetSearchInput,
    setRecentSearchTabs,
    uuid,
    company,
    companyTabs,
    recentSearchTabs,
    router,
  ]);
};

export const useLoadRecentSearchTabs = () => {
  const setState = useSetAtom(StateRecentSearchTabs);

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS);
    if (saved) {
      const tabs: TypeCompanyTab[] = JSON.parse(saved);
      setState(tabs);
    }
  }, [setState]);
};

export const useDeleteAllRecentClick = () => {
  const resetState = useResetAtom(StateRecentSearchTabs);

  return useCallback(() => {
    resetState();
    window.localStorage.removeItem(LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS);
  }, [resetState]);
};
