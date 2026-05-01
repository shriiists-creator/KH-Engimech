/**
 * Google Apps Script Web App for HK Engimech Lead Capture
 * 
 * Instructions:
 * 1. Go to script.google.com and create a new project.
 * 2. Paste this code into the editor (replace existing code).
 * 3. Save the project.
 * 4. Click "Deploy" -> "New deployment".
 * 5. Select "Web app" as the deployment type.
 * 6. Set "Execute as" to "Me", and "Who has access" to "Anyone".
 * 7. Click Deploy, authorize the script if prompted.
 * 8. Copy the "Web app URL" and paste it into the frontend script.js
 */

const SHEET_NAME_PRODUCTS = "Products Enquiry";
const SHEET_NAME_CONTACT = "Contact Us";

function doPost(e) {
  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString);

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Route logic based on form source (Contact vs Enquiry)
    if (data.formType === "Contact Us") {
      let sheet = ss.getSheetByName(SHEET_NAME_CONTACT);
      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME_CONTACT);
        sheet.appendRow(["Timestamp", "Name", "Mobile", "Source", "Interested Service", "Requirements"]);
      }
      
      sheet.appendRow([
        new Date(),
        data.name || "",
        data.mobile || "",
        data.source || "",
        data.service || "-",
        data.requirements || "-"
      ]);

      return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Contact saved" }))
        .setMimeType(ContentService.MimeType.JSON);

    } else {
      // Default to Products Enquiry
      let sheet = ss.getSheetByName(SHEET_NAME_PRODUCTS);
      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME_PRODUCTS);
        sheet.appendRow(["Timestamp", "Name", "Mobile", "Page Source", "Main Product", "Sub-Product", "Service Name"]);
      }

      sheet.appendRow([
        new Date(),
        data.name || "",
        data.mobile || "",
        data.source || "",
        data.mainProduct || "-",
        data.subProduct || "-",
        data.mainService || "-"
      ]);

      return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Enquiry saved" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handling CORS preflight requests (OPTIONS)
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}
