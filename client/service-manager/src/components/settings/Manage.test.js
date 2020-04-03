/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AuthContext, SettingsContext } from '../../App';
import { MemoryRouter, Route } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  mockDepartmentsJson,
  mockInterestJson
} from '../../../../testing/mockData';

import Manage from './Manage';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getSettings } from '../../../../testing/testHelpers';
import { render } from 'react-dom';

expect.extend(toHaveNoViolations);

it('renders service management settings view', async () => {
  const container = document.createElement('div');
  let settings = getSettings();

  fetch.resetMocks();
  fetch.doMockOnceIf(
    url => url.includes('/api/departments?locale=en'),
    mockDepartmentsJson
  );
  fetch.doMockOnceIf(
    url => url.includes('/api/departments?locale=es'),
    mockDepartmentsJson
  );
  fetch.doMockOnceIf(
    url => url.includes('/api/interests?locale=en'),
    mockInterestJson
  );
  fetch.doMockOnceIf(
    url => url.includes('/api/interests?locale=es'),
    mockInterestJson
  );

  await act(async () => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isLoggedIn: true,
            loggedInUser: { username: 'admin', roles: ['ROLE_ADMIN'] }
          }}
        >
          <SettingsContext.Provider
            value={{
              settings: settings,
              setSettings: newSettings => {
                settings = newSettings;
              }
            }}
          >
            <Route component={props => <Manage {...props} />} />
          </SettingsContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
      container
    );
  });

  expect(container).toMatchSnapshot();
  expect(await axe(container)).toHaveNoViolations();
});

it('renders service management settings view for non-admin', async () => {
  const container = document.createElement('div');
  let settings = getSettings();

  fetch.resetMocks();
  fetch.doMockOnceIf(
    url => url.includes('/api/departments?locale=en'),
    mockDepartmentsJson
  );
  fetch.doMockOnceIf(
    url => url.includes('/api/departments?locale=es'),
    mockDepartmentsJson
  );
  fetch.doMockOnceIf(
    url => url.includes('/api/interests?locale=en'),
    mockInterestJson
  );
  fetch.doMockOnceIf(
    url => url.includes('/api/interests?locale=es'),
    mockInterestJson
  );

  await act(async () => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isLoggedIn: true,
            loggedInUser: { username: 'user', roles: ['ROLE_USER'] }
          }}
        >
          <SettingsContext.Provider
            value={{
              settings: settings,
              setSettings: newSettings => {
                settings = newSettings;
              }
            }}
          >
            <Route component={props => <Manage {...props} />} />
          </SettingsContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
      container
    );
  });

  expect(container).toMatchSnapshot();
  expect(await axe(container)).toHaveNoViolations();
});
