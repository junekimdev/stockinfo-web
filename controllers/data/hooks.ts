import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { LOCAL_STORAGE_KEY_COMPANY_TABS } from '../apiURLs';
import { StateCompanyTabs, StateDetailsOpened } from './states';
import { TypeCompanyTab } from './types';

export const useLoadCompanyTabs = () => {
  const [tabs, setTabs] = useRecoilState(StateCompanyTabs);

  useEffect(() => {
    if (tabs.length) return;

    const tabsString = window.localStorage.getItem(LOCAL_STORAGE_KEY_COMPANY_TABS);
    if (tabsString) {
      try {
        const savedTabs: TypeCompanyTab[] = JSON.parse(tabsString);
        setTabs(savedTabs);
      } catch (error) {
        console.error(error);
      }
    }
  }, [tabs]);
};

export const useSaveTabsClick = () => {
  const tabs = useRecoilValue(StateCompanyTabs);

  return useCallback(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY_COMPANY_TABS, JSON.stringify(tabs));
    window.alert('Saved all tabs in storage');
  }, [tabs]);
};

export const useClearTabsClick = () => {
  return useCallback(() => {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY_COMPANY_TABS);
    window.alert('Cleared all tabs in storage');
  }, []);
};

export const useToggleDetails = () => {
  const setState = useSetRecoilState(StateDetailsOpened);

  return useCallback(() => setState((v) => !v), []);
};
