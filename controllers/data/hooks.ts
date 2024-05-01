import { useCallback, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { LOCAL_STORAGE_KEY_COMPANY_TABS } from '../apiURLs';
import { StateCompanyTabs, StateDetailsOpened, StatePriceRequestCode } from './states';
import { TypeCompanyTab, TypePriceRequest, TypePriceRequestType } from './types';

export const usePriceRequest = (uuid: string, type: TypePriceRequestType) => {
  const code = useRecoilValue(StatePriceRequestCode(uuid));
  return { code, type } as TypePriceRequest;
};

export const useLoadCompanyTabs = () => {
  const setTabs = useSetRecoilState(StateCompanyTabs);

  useEffect(() => {
    const tabsString = window.localStorage.getItem(LOCAL_STORAGE_KEY_COMPANY_TABS);
    if (tabsString) {
      try {
        const tabs: TypeCompanyTab[] = JSON.parse(tabsString);
        setTabs(tabs);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);
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
