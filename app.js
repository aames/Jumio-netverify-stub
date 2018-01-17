// Mock service based on https://github.com/Jumio/implementation-guides/blob/master/netverify/netverify-retrieval-api.md
// Author: Andrew Amesbury (2017)
const express = require('express'),
app = express(),
morgan = require('morgan'),
path = require("path"),
atob = require('atob');

app.use(morgan('dev'));

app.get('/api/netverify/v2/scans/:id', function (req, res) {
  if (validHeaders(req) === true)
  {
    if (req.params.id === '404')
    {
      res.status(404).send("Not Found");
    }
    else
    {
      res.json({
        timestamp: '2014-08-13T12:08:02.068Z',
        scanReference: req.params.id,
        status: 'DONE'
      });
    }
  }
  else
  {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/scans/:id/data', function (req, res) {
  if (validHeaders(req) === true){
    res.status(200).send(
      {
        timestamp: "2014-08-14T08:16:20.845Z",
        scanReference: req.params.id,
        document: document_type('PASSPORT'),
        transaction: transaction_data,
        verification: verification_status('OK')
      }
    );
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/scans/:id/data/document', function (req, res) {
  if (validHeaders(req) === true){
    res.status(200).send(document_type('PASSPORT'));
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/scans/:id/data/transaction', function (req, res) {
  if (validHeaders(req) === true){
    var temp = transaction_data;
    temp.scanReference = req.params.id;
    temp.timestamp = "2014-08-14T10:06:13.610Z";
    res.status(200).send(temp);
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/scans/:id/data/verification', function (req, res) {
  if (validHeaders(req) === true){
    var temp = verification_status('OK');
    temp.scanReference = req.params.id;
    temp.timestamp = "2014-08-14T10:06:13.610Z";
    res.status(200).send(temp);
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/scans/:id/data/images', function (req, res) {
  if (validHeaders(req) === true){
    var temp = image_body;
    temp.scanReference = req.params.id;
    res.status(200).send(temp);
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/scans/:id/data/images/:classifier', function (req, res) {
  if (validHeaders(req) === true) {
    var maskhint = req.query.maskhint;
    try {
      if (maskhint.indexOf('unmasked') >=0) {
        res.sendFile(path.join(process.cwd(), 'sample.jpg'));
      }
    } catch (e){
      if (e instanceof TypeError) {
        res.sendFile(path.join(process.cwd(), 'masked_sample.jpg'));
      }
    }
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/documents/:id', function (req, res) {
  if (validHeaders(req) === true){
    var temp = {
          scanReference: req.params.id,
          timestamp: "2015-08-13T12:08:02.068Z",
          status: "DONE"
    }
    res.status(200).send(temp);
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/documents/:id/data', function (req, res) {
  if (validHeaders(req) === true){
    res.status(200).send(scan_document_only);
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/documents/:id/data/document', function (req, res) {
  if (validHeaders(req) === true){
    res.status(200).send(scan_details);
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/documents/:id/data/transaction', function (req, res) {
  if (validHeaders(req) === true){
    res.status(200).send(transaction_data_only);
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/documents/:id/pages/', function (req, res) {
  if (validHeaders(req) === true) {
        res.send(image_body);
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.get('/api/netverify/v2/documents/:id/pages/:n', function (req, res) {
  if (validHeaders(req) === true) {
        res.sendFile(path.join(process.cwd(), 'sample.jpg'));
  }
  else {
    res.status(403).send("You do not have rights to visit this page");
  }
});

app.listen(5678, function () {
   console.log('listening on port 5678!');
});

function validHeaders(req){
  if (req.get('Content-Type') === 'application/json') {
    // Configure whatever you want here.
    if (req.get('User-Agent').indexOf('myAppName') !== -1) {
      return true;
    }
  }
  return false;
}

function document_type(type){
  switch(type){
    case 'PASSPORT':
      return passport_id;
      break;
    case 'DRIVING_LICENSE':
      return driving_license_id(); // unsupported - feel free to write it
      break;
    case 'ID_CARD':
      return card_id(); // unsupported - feel free to write it
      break;
    case 'VISA':
      return visa_id(); // unsupported - feel free to write it
      break;
    default:
      return unsupported_id(); // unsupported - feel free to write it
      break;
  }
}

var passport_id = {
      type: "PASSPORT",
      dob: "1990-01-01",
      expiry: "2022-12-31",
      firstName: "FIRSTNAME",
      issuingCountry: "USA",
      lastName: "LASTNAME",
      number: "P1234",
      issuingDate: "2015-11-01",
      status: "APPROVED_VERIFIED",
      scanReference: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      timestamp: "2014-08-14T09:05:47.394Z"
    };


var transaction_data = {
      clientIp: "xxx.xxx.xxx.xxx",
      customerId: "CUSTOMERID",
      date: "2014-08-10T10:27:29.494Z",
      source: "WEB_UPLOAD",
      status: "DONE"
    };

var scan_details = {
  scanReference: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  timestamp: "2015-08-14T08:16:20.845Z",
  document: {
    status: "EXTRACTED",
    type: "SSC",
    extractedData: {
      firstName: "FIRSTNAME",
      lastName: "LASTNAME",
      ssn: "12341234",
      signatureAvailable: true
    }
  },
  transaction: {
    status: "DONE",
    merchantReportingCriteria: "YOURMERCHANTREPORTINGCRITERIA",
    merchantScanReference: "YOURSCANREFERENCE",
    customerId: "CUSTOMERID",
    source: "DOC_UPLOAD"
  }
};

var scan_document_only = {
  scanReference: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  timestamp: "2015-08-14T08:16:20.845Z",
  status: "EXTRACTED",
  type: "SSC",
  extractedData: {
    firstName: "FIRSTNAME",
    lastName: "LASTNAME",
    ssn: "12341234",
    signatureAvailable: true
  }
};

var transaction_data_only = {
  scanReference: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  timestamp: "2015-08-14T10:06:13.610Z",
  status: "DONE",
  merchantReportingCriteria: "YOURMERCHANTREPORTINGCRITERIA",
  merchantScanReference: "YOURSCANREFERENCE",
  customerId: "CUSTOMERID",
  source: "DOC_UPLOAD"
}

var image_body = {
  "timestamp": "2014-08-14T11:22:20.182Z",
  "images": [
              {
                "classifier": "back",
                "href": "https://netverify.com/api/netverify/v2/scans/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/images/back"
              },
              {
                "classifier": "front",
                "href": "https://netverify.com/api/netverify/v2/scans/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/images/front"
              },
              {
                "classifier": "face",
                "href": "https://netverify.com/api/netverify/v2/scans/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/images/face"
              }
            ]
};

function verification_status(status){
  // valid status: OK, NOT_OK, NOT_AVAILABLE
  return { mrzCheck: status };
}
