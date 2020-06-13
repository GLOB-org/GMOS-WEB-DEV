var crypto = require('crypto');

export const encrypt=(text)=>{
  var cipher = crypto.createCipheriv("aes-128-cbc","gcm-e-commerce19", "19gcm-e-commerce");
  var crypted = cipher.update(text, 'utf8', 'binary');
  var cbase64  = Buffer.from(crypted, 'binary').toString('base64');
  crypted += cipher.final('binary');
  crypted = Buffer.from(crypted, 'binary').toString('base64');
  return crypted;
}

export const decrypt=(crypted)=>{
    crypted = Buffer.from(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv("aes-128-cbc","gcm-e-commerce19", "19gcm-e-commerce");
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
}

export const url={
    select: 'https://2jn9dctkcb.execute-api.ap-southeast-1.amazonaws.com/default/gcm_select' ,
    insert: 'https://jrs65kbpo5.execute-api.ap-southeast-1.amazonaws.com/default/gcm_insert'
}