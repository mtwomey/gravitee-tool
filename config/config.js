'use strict';

// const auth = {};
// auth.baseUrl = 'https://auth.topcoder.com';
// auth.endpointAuthorize = `${auth.baseUrl}/authorize`;
// auth.clientId='UW7BhsnmAQh0itl56g1jUPisBO9GoowD'
// auth.redirectUri = 'https://auth-redirect.topcoder.com';
// auth.audience = 'https://api.topcoder.com/';

const tempData = {};
tempData.directory = '/tmp';

const gravitee = {};

gravitee.envs = {};

gravitee.envs.prod = {
    endpoint: 'https://gravitee-management-api.topcoder.com/management/organizations/DEFAULT/environments/DEFAULT',
    gateway: 'https://gravitee-gw.topcoder.com'
};

gravitee.envs.dev = {
    endpoint: 'https://gravitee-management-api.topcoder-dev.com/management/organizations/DEFAULT/environments/DEFAULT',
    gateway: 'https://gravitee-gw.topcoder-dev.com'
};


module.exports = {
    tempData,
    gravitee
}

