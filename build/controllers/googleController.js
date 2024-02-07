"use strict";
// // AIzaSyCxCwy_5WcbPohpGvzS1mGNI_UMwEZsCdQ => api
// const { google } = require('googleapis');
// const path       = require('path');
// const { JWT }    = require('google-auth-library');
// const { response } = require('express');
// const credentialsPath               = path.resolve(__dirname, '../credentials.json');
// const credentials                   = require(credentialsPath);
// const { client_email, private_key } = credentials;
// // const spreadsheetId                 = '1_yUU052N_eF7kJXJzHu6Z1iPsDL48CcUdQ3Mqit3sbo'; // Teste
// const spreadsheetId                 = '1BkRtnDfhK66RLuX3dfs_5vzRoxQS7KnIECzsKXqyH1o'; //Contas
// const client = new JWT({
//     email: client_email,
//     key: private_key,
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });
// const sheets = google.sheets({ version: 'v4', auth: client });
// class googleController {
//     async get(req, res){
//         sheets.spreadsheets.get({
//             spreadsheetId: spreadsheetId,
//         }, (err, response) => {
//             if (err) return res.status(500).json({
//                 message : 'Erro interno ao obter dados da planilha.',
//                 errorMessage: err
//             });
//             if (response && response.data) {
//                 console.log('Autenticação bem-sucedida.');
//                 return res.status(200).json(response.data);
//             } else {
//                 return res.status(500).json({message: 'Resposta indefinida ou sem dados.'});
//             }
//         });
//     }
//     async postData(req, res){
//         const {
//             description,
//             category,
//             date,
//             payment_methods,
//             value,
//             from_who,
//             situation,
//             date_ok,
//             repeat,
//             parcel,
//             fixed
//         } = req.body;
//         // const lastRow = await this.getLastNonEmptyRow(spreadsheetId, "C");
//         const result = await sheets.spreadsheets.values.get({
//             spreadsheetId: spreadsheetId,
//             range: `A5:A`,
//         });
//         const values = result.data.values;
//         if (!values || values.length === 0) return res.status(500).json({message : "Não foi possivel achar a proxima linha."});
//         let lastRow = values.length;
//         while (lastRow > 0 && !values[lastRow - 1][0]) {
//             lastRow--;
//         }
//         const nextRow = lastRow + 1;
//         const range = `A${nextRow}`;
//         const fakeData = [
//             [description, category, date, payment_methods, value, from_who, situation, date_ok, repeat, parcel, fixed]
//         ];
//         console.log(range);
//         sheets.spreadsheets.values.append({
//             spreadsheetId: spreadsheetId,
//             range: range,
//             valueInputOption: "USER_ENTERED",
//             resource: {
//                 values: fakeData,
//             },
//         }, (err, response) => {
//             if(err){
//                 return res.status(500).json({
//                     message: 'Erro interno ao adicionar dados à planilha.',
//                     errorMessage: err,
//                 });
//             }
//             return res.status(200).json(response.data);
//         })
//     }
//     async getLastNonEmptyRow(spreadsheetId, column) {
//         console.log('aqui');
//     }
// }
// module.exports = new googleController();
