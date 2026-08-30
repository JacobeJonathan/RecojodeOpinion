const SHEET_NAME = 'Supervisiones';

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    service: 'Sistema de Supervisión CAR',
    message: 'API activa'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const action = body.action;

    if (action === 'save') return json(saveRecord(body.record));
    if (action === 'list') return json(listRecords());
    if (action === 'get') return json(getRecord(body.id));

    return json({ok:false,error:'Acción no válida'});
  } catch (err) {
    return json({ok:false,error:String(err)});
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['ID','Fecha registro','Hogar','Ciudad','Fecha supervisión','Informante','Cargo','Datos JSON','Última modificación']);
  }
  return sh;
}

function saveRecord(record) {
  const sh = getSheet_();
  const now = new Date();
  const id = record.id || ('CAR-' + Utilities.getUuid().slice(0,8).toUpperCase());

  const rowValues = [
    id,
    now,
    record.form?.hogar || '',
    record.form?.ciudad || '',
    record.form?.fecha || '',
    record.form?.informante || '',
    record.form?.cargo || '',
    JSON.stringify(record),
    now
  ];

  const lastRow = sh.getLastRow();
  let foundRow = -1;

  if (lastRow >= 2) {
    const ids = sh.getRange(2,1,lastRow-1,1).getValues().flat();
    const idx = ids.findIndex(x => String(x) === String(id));
    if (idx >= 0) foundRow = idx + 2;
  }

  if (foundRow > 0) {
    sh.getRange(foundRow,1,1,rowValues.length).setValues([rowValues]);
    return {ok:true,id:id,updated:true,row:foundRow};
  }

  sh.appendRow(rowValues);
  return {ok:true,id:id,updated:false,row:sh.getLastRow()};
}

function listRecords() {
  const sh = getSheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {ok:true,records:[]};

  const values = sh.getRange(2,1,lastRow-1,9).getValues();
  return {
    ok:true,
    records: values.map(r => ({
      id:String(r[0] || ''),
      hogar:String(r[2] || ''),
      ciudad:String(r[3] || ''),
      fecha:String(r[4] || ''),
      modified:r[8] instanceof Date ? r[8].toISOString() : String(r[8] || '')
    })).reverse()
  };
}

function getRecord(id) {
  if (!id) return {ok:false,error:'Falta ID'};
  const sh = getSheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {ok:false,error:'No hay registros'};

  const ids = sh.getRange(2,1,lastRow-1,1).getValues().flat();
  const idx = ids.findIndex(x => String(x) === String(id));
  if (idx < 0) return {ok:false,error:'Registro no encontrado'};

  const row = idx + 2;
  const raw = sh.getRange(row,8).getValue();
  return {ok:true,record:JSON.parse(raw)};
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
