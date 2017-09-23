import { Thing } from '@complycloud/brane';

import { Errors } from '..';

const certificateRequests = [];
const certificates = [];
let lastSerial = 0;

export default class CertificateAuthority extends Thing {
  static get id() { return 'CertificateAuthority'; }

  static get queries() {
    return [
      {
        name: 'CertificateRequests',
        handler: CertificateAuthority.getCertificateRequests,
      },
      {
        name: 'Certificates',
        handler: CertificateAuthority.getCertificates,
      },
    ];
  }

  static async handleCertificateRequested() {
    this.log.info({ certificateRequest: this.project() }, 'processing certificate request');
    certificateRequests.forEach((request) => {
      if (request.commonName === this.commonName && !request.processed) {
        throw new Errors.CertificateRequestCommonNameConflict();
      }
    });
    certificates.forEach((cert) => {
      if (cert.subject.commonName === this.commonName && !cert.revoked) {
        throw new Errors.CertificateCommonNameConflict();
      }
    });
    this.previousState = {
      certificateRequests,
    };
    certificateRequests.push(this);
    this.log.info('certificate request accepted');
    return {
      id: this.id,
    };
  }

  static async handleCertificateIssued() {
    this.log.info(
      { certificateRequestId: this.certificateRequestId, days: this.days },
      'processing certificate issuance',
    );
    let certificateRequestIdx = null;
    certificateRequests.some((request, i) => {
      if (request.id === this.certificateRequestId) {
        certificateRequestIdx = i;
        return true;
      }
      return false;
    });
    if (certificateRequestIdx == null) throw new Errors.CertificateRequestNotFound();
    if (certificateRequests[certificateRequestIdx].processed) throw new Errors.CertificateRequestAlreadyProcessed();
    certificateRequests[certificateRequestIdx].processed = true;
    this.notBefore = new Date();
    this.notAfter = new Date();
    this.notAfter.setTime(this.notBefore.getTime() + (this.days * 86400000)); // 8.64e+7 ms in a day
    this.subject = certificateRequests[certificateRequestIdx].project().subject;
    this.extensions = certificateRequests[certificateRequestIdx].project().extensions;
    this.serial = lastSerial + 1;
    lastSerial = this.serial;
    certificates.push(this);
    this.log.info({ certificate: this.project() }, 'certificate issued');
    return this.project();
  }

  static async handleCertificateRevoked() {
    this.log.info({ certificateId: this.certificateId }, 'processing certificate revocation');
    let certificateIdx = null;
    certificates.some((cert, i) => {
      if (cert.id === this.certificateId) {
        certificateIdx = i;
        return true;
      }
      return false;
    });
    if (certificateIdx == null) throw new Errors.CertificateNotFound();
    if (certificates[certificateIdx].revoked) throw new Errors.CertificateAlreadyRevoked();
    certificates[certificateIdx].revoked = true;
    this.log.info({ certificateId: this.certificateId }, 'certificate revoked');
    return this.project();
  }

  static async getCertificateRequests() {
    return certificateRequests.map(csr => csr.project());
  }

  static async getCertificates() {
    return certificates.map(cert => cert.project());
  }
}
