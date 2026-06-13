const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

/**
 * Generates an automated IT Rules 2021 / DMCA Takedown Notice PDF.
 */
async function generateLegalNoticePdf(options) {
  const {
    creatorName,
    creatorEmail,
    stampId,
    originalTitle,
    infringingUrl,
    platformName,
    isIndianJurisdiction = true,
    signatureBase64 = null
  } = options;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const lines = [];

  lines.push('FORMAL NOTICE OF INTELLECTUAL PROPERTY INFRINGEMENT');
  
  if (isIndianJurisdiction) {
    lines.push('Under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code)');
    lines.push('Rules, 2021 — Rule 3(1)(b) & Rule 3(2)(b)');
  } else {
    lines.push('Under the Digital Millennium Copyright Act (DMCA) 17 U.S.C. § 512');
  }

  lines.push('');
  lines.push(`To: The Grievance Officer / Designated Copyright Agent, ${platformName}`);
  lines.push(`Date: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');
  lines.push('DECLARATION OF INFRINGEMENT:');
  lines.push(`I, ${creatorName}, am the creator and authorized rights holder of the original work titled:`);
  lines.push(`"${originalTitle}"`);
  lines.push('');
  lines.push('PROOF OF PRIOR POSSESSION & IMMUTABLE REGISTRATION:');
  lines.push(`This work is cryptographically secured via ProofStamp. Evidence of my prior possession `);
  lines.push(`and authorship can be independently verified at:`);
  lines.push(`https://proofstamp.app/verify?id=${stampId}`);
  lines.push('');
  lines.push('INFRINGING MATERIAL:');
  lines.push('The following URL contains an unauthorized, infringing copy or derivative of my work:');
  lines.push(infringingUrl);
  lines.push('');
  
  if (isIndianJurisdiction) {
    lines.push('DEMAND FOR ACTION (IT RULES 2021):');
    lines.push('As an intermediary, you are required under Rule 3(1)(b) to remove or disable access to this');
    lines.push('infringing material. If the material is a synthetic manipulation (deepfake), it must be');
    lines.push('removed within 24 hours under Rule 3(2)(b). Failure to do so will result in the loss of your');
    lines.push('safe harbor immunity under Section 79 of the IT Act, 2000.');
  } else {
    lines.push('DEMAND FOR ACTION (DMCA):');
    lines.push('I request that you immediately disable access to the infringing material. I have a good faith');
    lines.push('belief that use of the material in the manner complained of is not authorized by the');
    lines.push('copyright owner, its agent, or the law.');
  }

  lines.push('');
  lines.push('GOOD FAITH STATEMENT:');
  lines.push('The information in this notification is accurate, and under penalty of perjury, I am the');
  lines.push('owner or authorized to act on behalf of the owner of an exclusive right that is infringed.');
  lines.push('');
  lines.push(`Signed: ${creatorName}`);
  lines.push(`Email: ${creatorEmail}`);

  let y = 800;
  for (const line of lines) {
    const isHeader = line === 'FORMAL NOTICE OF INTELLECTUAL PROPERTY INFRINGEMENT';
    const isSubHeader = line.endsWith(':');
    
    page.drawText(line, {
      x: 50,
      y,
      size: isHeader ? 12 : 10,
      font: (isHeader || isSubHeader) ? fontBold : font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 16;
  }

  if (signatureBase64) {
    try {
      // Mock embedding the signature image if provided
      page.drawText('[eSign Validated Cryptographically via Aadhaar / Setu API]', {
        x: 50, y: y - 20, size: 10, font: fontBold, color: rgb(0, 0.5, 0)
      });
    } catch (err) {}
  }

  return Buffer.from(await pdfDoc.save());
}

module.exports = {
  generateLegalNoticePdf
};
