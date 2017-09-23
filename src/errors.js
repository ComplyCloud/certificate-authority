import { Errors as BraneErrors } from '@complycloud/brane';

export class CertificateAlreadyRevoked extends BraneErrors.Conflict {
  get code() { return 'CERT_ALREADY_REVOKED'; }
}
export class CertificateCommonNameConflict extends BraneErrors.Conflict {
  get code() { return 'CERT_CN_CONFLICT'; }
}
export class CertificateNotFound extends BraneErrors.NotFound {
  get code() { return 'CERT_NOT_FOUND'; }
}

export class CertificateRequestAlreadyProcessed extends BraneErrors.Conflict {
  get code() { return 'CSR_ALREADY_PROCESSED'; }
}
export class CertificateRequestCommonNameConflict extends BraneErrors.Conflict {
  get code() { return 'CSR_CN_CONFLICT'; }
}
export class CertificateRequestNotFound extends BraneErrors.NotFound {
  get code() { return 'CSR_NOT_FOUND'; }
}
