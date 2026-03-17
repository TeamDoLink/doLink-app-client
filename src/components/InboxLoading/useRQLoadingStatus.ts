import { InboxLoadingProps } from '.';
import { MutationStatus } from '@tanstack/react-query';

const useRQLoadingStatus = (
  status: MutationStatus,
): InboxLoadingProps['status'] => {
  switch (status) {
    case 'pending':
      return 'loading';
    case 'error':
      return 'error';
    case 'success':
      return 'success';
  }

  return 'none';
};

export default useRQLoadingStatus;
