'use strict';

const requestWrapper = require('../../lib/requestwrapper');
requestWrapper.sendRequest = jest.fn();

const IamTokenManagerV1 = require('../../iam-token-manager/v1').IamTokenManagerV1;

describe('iam_token_manager_v1', function() {
  beforeEach(() => {
    requestWrapper.sendRequest.mockReset();
  });

  afterAll(() => {
    requestWrapper.sendRequest.mockRestore();
  });

  it('should return an access token given by the user', function(done) {
    const userManagedToken = 'abcd-1234';
    const instance = new IamTokenManagerV1({ iamAccessToken: userManagedToken });
    const requestMock = jest.spyOn(instance, 'requestToken');
    const refreshMock = jest.spyOn(instance, 'refreshToken');

    instance.getToken(function(err, token) {
      expect(token).toBe(userManagedToken);
      expect(requestMock).not.toHaveBeenCalled();
      expect(refreshMock).not.toHaveBeenCalled();
      done();
    });
  });

  it('should turn an iam apikey into an access token', function(done) {
    const instance = new IamTokenManagerV1({ iamApikey: 'abcd-1234' });
    const refreshMock = jest.spyOn(instance, 'refreshToken');

    const accessToken = '9012';
    const iamResponse = {
      access_token: accessToken,
      refresh_token: '3456',
      token_type: 'Bearer',
      expires_in: 3600,
      expiration: Math.floor(Date.now() / 1000) + 3600,
    };

    requestWrapper.sendRequest.mockImplementation((parameters, _callback) => {
      _callback(null, iamResponse);
    });

    instance.getToken(function(err, token) {
      expect(token).toBe(accessToken);
      expect(refreshMock).not.toHaveBeenCalled();
      done();
    });
  });

  it('should refresh an expired access token', function(done) {
    const instance = new IamTokenManagerV1({ iamApikey: 'abcd-1234' });
    const requestMock = jest.spyOn(instance, 'requestToken');

    const currentTokenInfo = {
      access_token: '1234',
      refresh_token: '5678',
      token_type: 'Bearer',
      expires_in: 3600,
      expiration: Math.floor(Date.now() / 1000),
    };

    instance.tokenInfo = currentTokenInfo;

    const accessToken = '9012';
    const iamResponse = {
      access_token: accessToken,
      refresh_token: '3456',
      token_type: 'Bearer',
      expires_in: 3600,
      expiration: Math.floor(Date.now() / 1000) + 3600,
    };

    requestWrapper.sendRequest.mockImplementation((parameters, _callback) => {
      _callback(null, iamResponse);
    });

    instance.getToken(function(err, token) {
      expect(token).toBe(accessToken);
      expect(requestMock).not.toHaveBeenCalled();
      done();
    });
  });

  it('should use a valid access token if one is stored', function(done) {
    const instance = new IamTokenManagerV1({ iamApikey: 'abcd-1234' });
    const requestMock = jest.spyOn(instance, 'requestToken');
    const refreshMock = jest.spyOn(instance, 'refreshToken');

    const accessToken = '1234';
    const currentTokenInfo = {
      access_token: accessToken,
      refresh_token: '5678',
      token_type: 'Bearer',
      expires_in: 3600,
      expiration: Math.floor(Date.now() / 1000) + 3000,
    };

    instance.tokenInfo = currentTokenInfo;

    instance.getToken(function(err, token) {
      expect(token).toBe(accessToken);
      expect(refreshMock).not.toHaveBeenCalled();
      expect(requestMock).not.toHaveBeenCalled();
      done();
    });
  });

  it('should return a user-managed access token if one is set post-construction', function(done) {
    const instance = new IamTokenManagerV1({ iamApikey: 'abcd-1234' });
    const requestMock = jest.spyOn(instance, 'requestToken');
    const refreshMock = jest.spyOn(instance, 'refreshToken');

    const accessToken = '9012';
    const currentTokenInfo = {
      access_token: '1234',
      refresh_token: '5678',
      token_type: 'Bearer',
      expires_in: 3600,
      expiration: Math.floor(Date.now() / 1000) + 3000,
    };

    instance.tokenInfo = currentTokenInfo;
    instance.setAccessToken(accessToken);

    instance.getToken(function(err, token) {
      expect(token).toBe(accessToken);
      expect(refreshMock).not.toHaveBeenCalled();
      expect(requestMock).not.toHaveBeenCalled();
      done();
    });
  });

  it('should refresh an access token without expires_in field', function(done) {
    const instance = new IamTokenManagerV1({ iamApikey: 'abcd-1234' });
    const requestMock = jest.spyOn(instance, 'requestToken');

    const currentTokenInfo = {
      access_token: '1234',
      refresh_token: '5678',
      token_type: 'Bearer',
      expiration: Math.floor(Date.now() / 1000),
    };

    instance.tokenInfo = currentTokenInfo;

    const accessToken = '9012';
    const iamResponse = {
      access_token: accessToken,
      refresh_token: '3456',
      token_type: 'Bearer',
      expires_in: 3600,
      expiration: Math.floor(Date.now() / 1000) + 3600,
    };

    requestWrapper.sendRequest.mockImplementation((parameters, _callback) => {
      _callback(null, iamResponse);
    });

    instance.getToken(function(err, token) {
      expect(token).toBe(accessToken);
      expect(requestMock).not.toHaveBeenCalled();
      done();
    });
  });

  it('should request a new token when refresh token does not have expiration field', function(done) {
    const instance = new IamTokenManagerV1({ iamApikey: 'abcd-1234' });
    const refreshMock = jest.spyOn(instance, 'refreshToken');

    const currentTokenInfo = {
      access_token: '1234',
      refresh_token: '5678',
      token_type: 'Bearer',
    };

    instance.tokenInfo = currentTokenInfo;

    const accessToken = '9012';
    const iamResponse = {
      access_token: accessToken,
      refresh_token: '3456',
      token_type: 'Bearer',
      expires_in: 3600,
      expiration: Math.floor(Date.now() / 1000) + 3600,
    };

    requestWrapper.sendRequest.mockImplementation((parameters, _callback) => {
      _callback(null, iamResponse);
    });

    instance.getToken(function(err, token) {
      expect(token).toBe(accessToken);
      expect(refreshMock).not.toHaveBeenCalled();
      done();
    });
  });
});
