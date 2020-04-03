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

import { axe, toHaveNoViolations } from 'jest-axe';

import ActionModal from './ActionModal';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getModal } from '../../../testing/testHelpers';
import { render } from 'react-dom';

expect.extend(toHaveNoViolations);

it('renders action modal', async () => {
  const container = document.createElement('div');

  await act(async () => {
    render(
      <ActionModal
        title="Do you really want to do this?"
        cancelText="No, cancel"
        onCancel={() => {}}
        actionText="Yes, do"
        onAction={() => {}}
      >
        Will happen if you do
      </ActionModal>,
      container
    );
  });

  expect(getModal()).toMatchSnapshot();
  expect(await axe(getModal())).toHaveNoViolations();
});
