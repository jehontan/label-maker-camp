import gql from 'graphql-tag';
import Amplify, { Auth } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const client = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () => {
      await Auth.signIn(process.env.REACT_APP_AWS_USERNAME, process.env.REACT_APP_AWS_PASSWORD);
      return (await Auth.currentSession())
        .getIdToken()
        .getJwtToken();
    }
  },
});

const Query = gql(`
query ListUsers {
  listUsers {
    items {
      name
      finNo
      medication
      bed {
        priority
        sector
        tent
        serial
      }
      timeEnrolled
      owner
      enrolled
    }
  }
}
`);

export function listUsers(cb) {
  client.query({
    query: Query
  })
  .then(response => {
    cb(null, response.data.listUsers.items);
  })
  .catch(err => cb(err, null));
}