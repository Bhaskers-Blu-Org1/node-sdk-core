/**
 * Copyright 2019 IBM Corp. All Rights Reserved.
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

import { Authenticator } from './authenticator';
import { AuthenticateCallback, AuthenticateOptions, AuthenticatorInterface } from './authenticator-interface';

export class NoauthAuthenticator extends Authenticator implements AuthenticatorInterface {
  /**
   * Noauth Authenticator Class
   *
   * Provides a way to use a service without specifying credentials.
   *
   * @constructor
   */
  constructor() {    
    super();
  }

  public authenticate(options: AuthenticateOptions, callback: AuthenticateCallback): void {
    // immediately proceed to request. it will probably fail
    callback(null);
  }
}