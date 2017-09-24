import { Event } from '@complycloud/brane';

export default class CertificateDenied extends Event {
  static get name() { return 'CertificateDenied'; }

  static get action() {
    return {
      name: 'DenyCertificate',
    };
  }

  static get dependencies() {
    return ['log'];
  }

  static get schema() {
    return {
      certificateRequestId: { type: 'string', format: 'uuid', required: true },
    };
  }

  async process({ CertificateAuthority }) {
    return CertificateAuthority.handleCertificateDenied.call(this);
  }

  project() {
    return {
      id: this.id,
      deniedAt: this.timestamp,
      certificateRequestId: this.certificateRequestId,
    };
  }
}
