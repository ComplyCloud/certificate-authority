import { Service } from '@complycloud/brane';
import { BunyanLogger } from '@complycloud/brane-bunyan';
import { GraphQLInterface } from '@complycloud/brane-graphql';

export default class CertificateAuthorityService extends Service {
  get id() { return 'certificate-authority'; }

  get dependencies() {
    return [
      new BunyanLogger(),
      new GraphQLInterface(),
    ];
  }
}
