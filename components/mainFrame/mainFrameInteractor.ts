import { MouseEvent, useCallback } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { StateCompanyTabs, StateCurrentTab } from '../../controllers/data/states';
import { TypeCompanyTab } from '../../controllers/data/types';
import { MainFrameStateMenuOpened } from './mainFrameStates';

export const useToggleMenu = () => {
  const setState = useSetRecoilState(MainFrameStateMenuOpened);

  return useCallback(() => setState((v) => !v), []);
};

export const useCloseAllClick = () => {
  const resetTabs = useResetRecoilState(StateCompanyTabs);
  const resetCurrent = useResetRecoilState(StateCurrentTab);
  const setOpened = useSetRecoilState(MainFrameStateMenuOpened);

  return useCallback(() => {
    resetTabs();
    resetCurrent();
    setOpened(false);
  }, []);
};

export const useAddNewTabClick = () => {
  const resetState = useResetRecoilState(StateCurrentTab);

  return useCallback(() => resetState(), []);
};

export const useMoveToTabClick = (tab: TypeCompanyTab) => {
  const setState = useSetRecoilState(StateCurrentTab);

  return useCallback(() => setState(tab), [tab]);
};

export const useRemoveTabClick = (tab: TypeCompanyTab) => {
  const [tabs, setTabs] = useRecoilState(StateCompanyTabs);
  const currentTab = useRecoilValue(StateCurrentTab);
  const resetCurrent = useResetRecoilState(StateCurrentTab);

  return useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();

      setTabs(tabs.filter((v) => v.uuid !== tab.uuid));
      if (currentTab.uuid === tab.uuid) resetCurrent();
    },
    [tab, tabs, currentTab],
  );
};

export const useSwitchTypeBtnClick = () => {
  const setTabs = useSetRecoilState(StateCompanyTabs);
  const [currentTab, setCurrentTab] = useRecoilState(StateCurrentTab);

  return useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      const mainType = currentTab.mainType === 'daily' ? 'weekly' : 'daily';
      const updatedTab = { ...currentTab, mainType };

      setCurrentTab(updatedTab);

      setTabs((prev) => prev.map((v) => (v.uuid === currentTab.uuid ? updatedTab : v)));
    },
    [currentTab],
  );
};
