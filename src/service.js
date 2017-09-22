import { Service } from '@complycloud/brane';
import { BunyanLogger } from '@complycloud/brane-bunyan';
import { Configuration } from '@complycloud/brane-config';
import { GraphQLInterface } from '@complycloud/brane-graphql';
import { RESTInterface } from '@complycloud/brane-rest';

export default class CertificateAuthorityService extends Service {
  get id() { return 'certificate-authority'; }

  get dependencies() {
    return [
      new BunyanLogger(),
      new Configuration(),
      new GraphQLInterface(),
      new RESTInterface(),
    ];
  }
}
