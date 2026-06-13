const SYSTEM_OPERATIONS_AFFIDAVIT = `AFFIDAVIT REGARDING SYSTEM OPERATIONS AND ELECTRONIC RECORD CUSTODY

I, the undersigned Authorized Signatory of ProofStamp, do hereby solemnly affirm and state as follows:

1. I am an authorized officer of the ProofStamp verification platform and I am competent to swear this affidavit regarding the technical operations of the system.

2. This affidavit details the standard operating procedures of the ProofStamp computer system, which produces the electronic records and Section 63 System Certificates provided to users.

3. SYSTEM ARCHITECTURE & INTEGRITY
   a. The ProofStamp platform operates on secure cloud infrastructure.
   b. When a file is uploaded to the platform, the file is not modified. The system immediately computes a SHA-256 cryptographic hash of the file in its original state.
   c. The file is then stored in an immutable, access-controlled cloud object storage bucket.
   d. The system relies on standard cryptographic libraries (Node.js Crypto module) to ensure hashing accuracy.

4. INDEPENDENT TIMESTAMPING (RFC 3161)
   a. To establish the precise time of possession, the system transmits the SHA-256 hash (never the file itself) to an independent, recognized Timestamping Authority (TSA) operating under the RFC 3161 protocol.
   b. The TSA returns a cryptographically signed Timestamp Token (.tsr) locking the hash to the precise time.
   c. ProofStamp has no ability to alter or backdate the time provided by the independent TSA.

5. CHAIN OF CUSTODY
   a. The combination of the SHA-256 hash, the RFC 3161 timestamp, and the creator's digital signature forms the "Stamp Record."
   b. This record is committed to a secure PostgreSQL database.
   c. All actions on the platform are logged in an append-only audit trail.

6. ORDINARY COURSE OF BUSINESS
   a. At all times relevant to the issuance of the attached Section 63 System Certificate, the ProofStamp computer system was operating correctly and in the ordinary course of business.
   b. There were no operational failures or unauthorized interventions that could have affected the integrity of the electronic record.

7. INDEPENDENT VERIFIABILITY
   a. The evidentiary value of the ProofStamp record does not rely solely on the ProofStamp organization.
   b. Any opposing counsel or technical expert can independently verify the SHA-256 hash of the source file.
   c. Any expert can independently verify the TSA token using standard tools (e.g., OpenSSL) and the public certificate of the Timestamping Authority.

This statement is made to support the admissibility of the electronic record under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023.

Signed: ___________________________
Name:   ___________________________
Title:  System Operations Officer
Date:   ___________________________
`;

module.exports = {
  SYSTEM_OPERATIONS_AFFIDAVIT,
};
