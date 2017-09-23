import { Event } from '@complycloud/brane';

export default class CertificateIssued extends Event {
  static get name() { return 'CertificateIssued'; }

  static get action() {
    return {
      name: 'IssueCertificate',
    };
  }

  static get dependencies() {
    return ['log'];
  }

  static get schema() {
    return {
      certificateRequestId: { type: 'string', format: 'uuid', required: true },
      days: { type: 'integer', minValue: 0, maxValue: 3650, required: true },
    };
  }

  async process({ CertificateAuthority }) {
    return CertificateAuthority.handleCertificateIssued.call(this);
  }

  project() {
    return {
      id: this.id,
      issuedAt: this.timestamp,
      revoked: !!this.revoked,
      certificateRequestId: this.certificateRequestId,
      extensions: this.extensions,
      subject: this.subject,
      notBefore: this.notBefore,
      notAfter: this.notAfter,
    };
  }
}
