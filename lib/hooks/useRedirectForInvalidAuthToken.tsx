import * as Sentry from '@sentry/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { QueryKeys } from 'types/client/accountQueries';

import * as cookies from 'lib/cookies';
import link from 'lib/link/link';

export interface ErrorType {
  error?: {
    status: Response['status'];
    statusText: Response['statusText'];
  };
}

export default function useRedirectForInvalidAuthToken() {
  const queryClient = useQueryClient();

  const state = queryClient.getQueryState<unknown, ErrorType>([ QueryKeys.profile ]);
  const errorStatus = state?.error?.error?.status;

  React.useEffect(() => {
    if (errorStatus === 401) {
      const apiToken = cookies.get(cookies.NAMES.API_TOKEN);

      if (apiToken) {
        Sentry.captureException(new Error('Invalid api token'), { tags: { source: 'fetch' } });
        const authURL = link('auth');
        window.location.assign(authURL);
      }
    }
  }, [ errorStatus ]);
}