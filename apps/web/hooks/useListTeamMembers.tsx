import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { commonApi } from '@libs/api';
import { useQuery } from '@tanstack/react-query';

export function useListTeamMembers() {
  const { data: memberList, isLoading: isMembersDataLoading } = useQuery<any, IErrorObject>(
    [API_KEYS.LIST_TEAM_MEMBERS],
    () => commonApi(API_KEYS.LIST_TEAM_MEMBERS as any, {})
  );

  return {
    memberList,
    isMembersDataLoading,
  };
}
