const assert = require('chai').assert;
const getContentType = require('../lib/contentType.js').getContentType;
const getFileExtension = require('../lib/contentType.js').getFileExtension;

describe('getFileExtension',()=>{
  it('should give fileExtension of txt file',()=>{
    let extension = getFileExtension('one.txt');
    assert.equal(extension,'.txt');
  })

  it('should give fileExtension of html file',()=>{
    let extension = getFileExtension('one.html');
    assert.equal(extension,'.html');
  })
})

describe('getContentType',()=>{
  it('should give contentType of html file',()=>{
    let mime = getContentType('one.html');
    assert.equal(mime,'text/html');
  })

  it('should give contentType of css file',()=>{
    let mime = getContentType('one.css');
    assert.equal(mime,'text/css');
  })
})
