import { Thing } from '@complycloud/brane';
import { omit } from 'lodash';

import { Errors } from '..';

const outstandingCertificateRequests = [];

export default class CertificateAuthority extends Thing {
  static get id() { return 'CertificateAuthority'; }

  static get queries() {
    return [
      {
        name: 'GetOutstandingCertificateRequests',
        handler: CertificateAuthority.getOutstandingCertificateRequests,
      },
    ];
  }

  static async handleCertificateRequested() {
    this.log.info({ certificateRequest: this.project() }, 'processing certificate request');
    if (outstandingCertificateRequests.find(request => request.commonName === this.commonName)) {
      throw new Errors.CertificateConflict('there is an outstanding certificate request with this common name');
    }
    const approval = 'pending';
    this.previousState = {
      outstandingCertificateRequests,
    };
    outstandingCertificateRequests.push(this);
    this.log.info({ approval }, 'certificate request accepted');
    return {
      id: this.id,
      approval,
    };
  }

  static getOutstandingCertificateRequests() {
    return omit(outstandingCertificateRequests, ['previousState']);
  }
}
