import { Event } from '@complycloud/brane';

export default class CertificateRequested extends Event {
  static get name() { return 'CertificateRequested'; }

  static get action() {
    return {
      name: 'RequestCertificate',
    };
  }

  static get dependencies() {
    return ['log'];
  }

  static get schema() {
    return {
      commonName: { type: 'string', pattern: /^\w[\w\s]*\w+$/, required: true },
      countryName: { type: 'string', pattern: /^[A-Z]{2}$/, required: true },
      stateOrProvinceName: { type: 'string', pattern: /^\w[\w\s]*\w$/, required: true },
      localityName: { type: 'string', pattern: /^\w[\w\s]*\w$/, required: true },
      organizationName: { type: 'string', pattern: /^\w[\w\s]*\w$/, required: true },
      organizationalUnitName: { type: 'string', pattern: /^\w[\w\s]*\w+$/, required: false },
      subjectAlternativeNames: {
        type: 'array',
        items: { type: 'string', pattern: /^DNS:[a-zA-Z0-9][a-zA-Z0-9.-]+[a-zA-Z0-9]$/ },
        minItems: 0,
        required: false,
      },
    };
  }

  async process({ CertificateAuthority }) {
    return CertificateAuthority.handleCertificateRequested.call(this);
  }

  project() {
    return {
      subject: {
        commonName: this.commonName,
        countryName: this.countryName,
        stateOrProvinceName: this.stateOrProvinceName,
        localityName: this.localityName,
        organizationName: this.organizationName,
        organizationalUnitName: this.organizationalUnitName,
        subjectAlternativeNames: this.subjectAlternativeNames,
      },
    };
  }
}
