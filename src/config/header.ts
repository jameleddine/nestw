let ADMIN_SESSION_TOKEN = '';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'App-Token': process.env.APP_TOKEN,
};
export const ADMIN_DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'App-Token': process.env.ADMIN_APP_TOKEN,
};

export const getAdminAuthHeaders = authorization => ({
  headers: { ...ADMIN_DEFAULT_HEADERS, authorization },
});

export const getAuthHeaders = authorization => ({
  headers: { ...DEFAULT_HEADERS, authorization },
});

export const getHeaders = token => ({
  headers: {
    ...DEFAULT_HEADERS,
    'session-token': token,
  },
});

export const getAdminHeaders = token => ({
  headers: {
    ...DEFAULT_HEADERS,
    'session-token': token,
  },
});


export const AdminHeadersDownloadDocument = token => ({
  headers: {
    ...DEFAULT_HEADERS,
    'session-token': token,
  'Accept': 'application/octet-stream',
  },
});


export function setHeadersAuthorization(credential) {
  return `Basic ${Buffer.from(
    `${credential.login}:${credential.pass}`,
  ).toString('base64')}`;
}

export function setAdminHeadersAuthorization() {
  return `Basic ${Buffer.from(
    `${process.env.ADMIN_LOGIN}:${process.env.ADMIN_PASSWORD}`,
  ).toString('base64')}`;
}

export function setAdminSessionToken(adminSessionToken) {
  ADMIN_SESSION_TOKEN = adminSessionToken.session_token;
}

export function getAdminSessionToken() {
  return ADMIN_SESSION_TOKEN;
}
