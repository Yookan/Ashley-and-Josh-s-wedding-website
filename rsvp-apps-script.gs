/**
 * ============================================================
 *  RSVP backend — Google Apps Script
 *  Receives form posts from rsvp.html and appends rows to a
 *  Google Sheet you own. One row per guest in the party.
 * ============================================================
 *
 *  ONE-TIME SETUP (≈ 5 minutes)
 *  ----------------------------
 *
 *  1. Create the spreadsheet.
 *     • Go to https://sheets.google.com → New blank spreadsheet.
 *     • Rename it (e.g. "Wedding RSVPs").
 *     • Rename the first sheet tab from "Sheet1" to: RSVPs
 *     • Paste this header row into row 1, exactly:
 *
 *       Timestamp | Submission ID | Full Name | Email | Attending | Vegetarian | Vegan | Gluten-Free | Dairy-Free | Nut Allergy | Shellfish Allergy | Other Dietary Notes | Message | Song Request
 *
 *       (Tip: copy the line above, click cell A1, paste — it splits across columns.)
 *
 *     • Bold row 1 and freeze it (View → Freeze → 1 row) so it stays at the top.
 *
 *  2. Copy the spreadsheet ID.
 *     The URL looks like:
 *       https://docs.google.com/spreadsheets/d/THIS_LONG_ID_HERE/edit
 *     Copy THIS_LONG_ID_HERE.
 *
 *  3. Create the Apps Script.
 *     • Go to https://script.google.com → New project.
 *     • Name it "Wedding RSVP".
 *     • Delete any boilerplate code.
 *     • Paste THIS ENTIRE FILE'S CONTENTS in.
 *     • Replace SPREADSHEET_ID_HERE below with the ID from step 2.
 *     • Save (Ctrl+S / ⌘S).
 *
 *  4. Deploy as a web app.
 *     • Click Deploy → New deployment.
 *     • Click the gear icon → Web app.
 *     • Description: "RSVP receiver".
 *     • Execute as: Me (your-email@gmail.com)
 *     • Who has access: Anyone
 *     • Click Deploy.
 *     • Authorize the script when prompted (click Advanced → Go to Wedding RSVP
 *       (unsafe) → Allow). This is normal for unverified personal scripts.
 *     • Copy the Web app URL that appears. It looks like:
 *       https://script.google.com/macros/s/AKfycb.../exec
 *
 *  5. Wire it into the site.
 *     • Open rsvp.html.
 *     • Find the line:  const RSVP_ENDPOINT = 'SCRIPT_URL_HERE';
 *     • Replace SCRIPT_URL_HERE with the URL from step 4.
 *     • Save and (re)deploy the site.
 *
 *  6. Test it.
 *     • Open rsvp.html in a browser, fill the form, submit.
 *     • Open the spreadsheet — your test row(s) should appear immediately.
 *     • Delete the test rows when you're satisfied.
 *
 *  RE-DEPLOYING AFTER YOU CHANGE THIS SCRIPT
 *  -----------------------------------------
 *  Apps Script web apps are immutable per deployment. If you edit this code:
 *    • Click Deploy → Manage deployments → pencil (Edit).
 *    • In Version, choose "New version".
 *    • Click Deploy. The URL stays the same; no need to update rsvp.html.
 *
 * ============================================================
 */

// ⬇⬇⬇  REPLACE THIS WITH YOUR SPREADSHEET ID  ⬇⬇⬇
const SPREADSHEET_ID = 'SPREADSHEET_ID_HERE';
const SHEET_NAME = 'RSVPs';

// Column order must match the header row in the sheet.
const DIET_KEYS = ['vegetarian', 'vegan', 'glutenFree', 'dairyFree', 'nutAllergy', 'shellfishAllergy'];

function doPost(e) {
  try {
    if (!e || !e.parameter || !e.parameter.payload) {
      return jsonOut({ ok: false, error: 'Missing payload.' });
    }

    const data = JSON.parse(e.parameter.payload);

    // Light validation — the client validates too, but never trust the client.
    if (!data.email || !Array.isArray(data.guests) || data.guests.length === 0) {
      return jsonOut({ ok: false, error: 'Invalid submission.' });
    }
    if (data.guests.length > 10) {
      return jsonOut({ ok: false, error: 'Too many guests in one submission.' });
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return jsonOut({ ok: false, error: 'Sheet "' + SHEET_NAME + '" not found.' });

    const submissionId = Utilities.getUuid().substring(0, 8);
    const ts = new Date();

    const rows = data.guests.map((g, i) => {
      const diet = Array.isArray(g.diet) ? g.diet : [];
      return [
        ts,
        submissionId,
        String(g.name || '').trim(),
        String(data.email || '').trim(),
        String(g.attending || '').trim(),
        ...DIET_KEYS.map(k => diet.indexOf(k) !== -1 ? '✓' : ''),
        String(g.dietOther || '').trim(),
        // Message and song request only on the first row of the submission,
        // to keep the sheet readable for multi-guest replies.
        i === 0 ? String(data.message || '').trim() : '',
        i === 0 ? String(data.songRequest || '').trim() : ''
      ];
    });

    // Append all rows in one call (faster + atomic).
    const startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);

    return jsonOut({ ok: true, count: rows.length, submissionId });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  // Health check — visiting the URL in a browser should show this.
  return ContentService
    .createTextOutput('RSVP endpoint is live. POST submissions only.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
