import { Event } from '@complycloud/brane';

export default class CertificateRevoked extends Event {
  static get name() { return 'CertificateRevoked'; }

  static get action() {
    return {
      name: 'RevokeCertificate',
    };
  }

  static get dependencies() {
    return ['log'];
  }

  static get schema() {
    return {
      certificateId: { type: 'string', format: 'uuid', required: true },
    };
  }

  async process({ CertificateAuthority }) {
    return CertificateAuthority.handleCertificateRevoked.call(this);
  }

  project() {
    return {
      id: this.id,
      revokedAt: this.timestamp,
      certificateId: this.id,
    };
  }
}
